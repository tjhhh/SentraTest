import { api } from "./api";

export interface ExportParams {
  format: string;
  fileName?: string;
  payload: any;
}

export interface ExportResponse {
  fileName: string;
  contentType: string;
  base64: string;
}

export const exportService = {
  pdf: (data: ExportParams) => api.post<ExportResponse>("/export/pdf", { ...data, format: "PDF" }),
  json: (data: ExportParams) => api.post<ExportResponse>("/export/json", { ...data, format: "JSON" }),
  zip: (data: ExportParams) => api.post<ExportResponse>("/export/zip", { ...data, format: "ZIP" }),
  docx: (data: ExportParams) => api.post<ExportResponse>("/export/docx", { ...data, format: "DOCX" }),
};
