import { buildApiUrl } from "@/config/api";

type FetchOptions = RequestInit & {
  body?: any;
};

import { useNotificationStore } from "@/store/notificationStore";

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth-storage") : null;
  let accessToken = "";
  
  if (token) {
    try {
      const parsed = JSON.parse(token);
      accessToken = parsed.state?.token || "";
    } catch (e) {
      console.error("Failed to parse auth token", e);
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === "object") {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(buildApiUrl(endpoint), config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.error?.message || response.statusText || "API request failed";
      
      // Global error notification
      if (typeof window !== "undefined") {
        useNotificationStore.getState().addNotification({
          type: "error",
          title: "API Error",
          message,
        });
      }
      
      throw new Error(message);
    }

    const result = await response.json();
    return result.data;
  } catch (error: any) {
    // Only show toast if it wasn't already shown above (network errors)
    if (typeof window !== "undefined" && error.message !== "API request failed") {
       const isNetworkError = !error.response; // simplistic check
       if (isNetworkError && !endpoint.includes('auth/refresh')) { // avoid spamming on background refresh
         useNotificationStore.getState().addNotification({
           type: "error",
           title: "Connection Error",
           message: "Unable to reach the server. Please check your internet connection.",
         });
       }
    }
    throw error;
  }
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) => 
    apiFetch<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, body?: any, options?: FetchOptions) => 
    apiFetch<T>(endpoint, { ...options, method: "POST", body }),
  put: <T>(endpoint: string, body?: any, options?: FetchOptions) => 
    apiFetch<T>(endpoint, { ...options, method: "PUT", body }),
  patch: <T>(endpoint: string, body?: any, options?: FetchOptions) => 
    apiFetch<T>(endpoint, { ...options, method: "PATCH", body }),
  delete: <T>(endpoint: string, options?: FetchOptions) => 
    apiFetch<T>(endpoint, { ...options, method: "DELETE" }),
};
