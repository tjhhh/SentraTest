import { api } from "./api";
import { 
  BBGenerateParams, 
  BBGenerateResponse, 
  BBScriptParams, 
  BBScriptResponse, 
  BBExportParams, 
  BBExportResponse 
} from "../types/blackbox";

export const bbService = {
  /**
   * Generates blackbox test cases based on requirements and selected method.
   */
  generate: (data: BBGenerateParams) => 
    api.post<BBGenerateResponse>("/bb/generate", data),
  
  /**
   * Generates a Playwright script from provided test cases.
   */
  script: (data: BBScriptParams) => 
    api.post<BBScriptResponse>("/bb/script", data),
  
  /**
   * Exports test results in the specified format.
   */
  export: (data: BBExportParams) => 
    api.post<BBExportResponse>("/bb/export", data),
};
