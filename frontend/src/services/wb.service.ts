import { api } from "./api";
import { WBAnalyzeParams, WBAnalyzeResponse, WBScriptResponse } from "../types/whitebox";

export const wbService = {
  /**
   * Performs whitebox analysis on the provided source code.
   */
  analyze: (data: WBAnalyzeParams) => 
    api.post<WBAnalyzeResponse>("/wb/analyze", data),
  
  /**
   * Generates a Playwright script based on the whitebox analysis results.
   */
  script: (analysis: any) => 
    api.post<WBScriptResponse>("/wb/script", { analysis }),

  /**
   * Retrieves whitebox history for a conversation.
   */
  getHistory: (conversationId: string) => 
    api.get<any>(`/wb/history/${conversationId}`),
};
