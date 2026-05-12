export interface BugExplainParams {
  stackTrace: string;
  context?: string;
}

export interface BugExplainResponse {
  mode: "bug-explain";
  content: {
    analysis?: string;
    explanation?: string;
    suggestion?: string;
    raw?: string;
    note?: string;
    [key: string]: any;
  };
}
