import { api } from "./api";
import { Conversation, Message } from "../types/conversation";

export const conversationService = {
  list: () => api.get<Conversation[]>("/conversations"),
  
  create: (title: string) => 
    api.post<Conversation>("/conversations", { title }),
  
  rename: (id: string, title: string) => 
    api.patch<Conversation>(`/conversations/${id}`, { title }),
  
  delete: (id: string) => 
    api.delete(`/conversations/${id}`),
    
  getMessages: (conversationId: string) => 
    api.get<Message[]>(`/conversations/${conversationId}`),
};
