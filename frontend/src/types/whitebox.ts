export type CoverageType = "STATEMENT" | "BRANCH" | "PATH";

export interface WBAnalyzeParams {
  conversationId?: string;
  coverageType: CoverageType;
  sourceCode: string;
}

export interface WBAnalyzeResponse {
  mode: "whitebox";
  content: any; // We can refine this later if we have a concrete structure from Gemini
}

export interface WBScriptResponse {
  script: string;
}
