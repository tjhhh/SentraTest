import { api } from "./api";
import { BugExplainParams, BugExplainResponse } from "../types/bug";

export const bugService = {
  /**
   * Submits a stack trace and context for AI analysis and explanation.
   */
  explain: (data: BugExplainParams) => 
    api.post<BugExplainResponse>("/bug/explain", data),
};
