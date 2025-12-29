declare module '@google/genai' {
  export interface GoogleGenAIOptions {
    apiKey: string;
  }

  export interface GenerateContentParams {
    model: string;
    contents: any;
    config?: any;
  }

  export interface GenerateContentResponse {
    text?: string;
  }

  export class GoogleGenAI {
    constructor(options: GoogleGenAIOptions);
    models: {
      generateContent: (params: GenerateContentParams) => Promise<GenerateContentResponse>;
    };
  }
}
