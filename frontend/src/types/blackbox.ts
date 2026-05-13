export type BBMethod = "BVA" | "EQP" | "DT";
export type ExportFormat = "PDF" | "DOCX" | "JSON" | "ZIP" | "XLSX";

export interface BBGenerateParams {
  conversationId?: string;
  method: BBMethod;
  requirement: string;
}

export interface BBScriptParams {
  conversationId?: string;
  method: BBMethod;
  testCases: any[];
}

export interface BBExportParams {
  format: ExportFormat;
  payload: any;
}

export interface BBGenerateResponse {
  mode: "blackbox";
  content: any;
}

export interface BBScriptResponse {
  script: string;
}

export interface BBExportResponse {
  fileName: string;
  contentType: string;
  base64: string;
}
