import { api } from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const chatService = {
  send: (conversationId: string, message: string) => 
    api.post("/chat", { conversationId, message, stream: false }),

  stream: async (conversationId: string, message: string, onChunk: (chunk: string) => void) => {
    const tokenStr = typeof window !== "undefined" ? localStorage.getItem("auth-storage") : null;
    let accessToken = "";
    
    if (tokenStr) {
      try {
        const parsed = JSON.parse(tokenStr);
        accessToken = parsed.state?.token || "";
      } catch (e) {
        console.error("Failed to parse auth token", e);
      }
    }

    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ conversationId, message, stream: true })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || response.statusText || "Streaming request failed");
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) throw new Error("Response body is not readable");

    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      
      // SSE format is "data: {...}\n\n"
      const lines = chunkValue.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.text) {
              onChunk(data.text);
            }
          } catch (e) {
            // Ignore non-JSON data or incomplete JSON
          }
        }
      }
    }
  },

  getHistory: () => api.get("/chat/history"),
};
