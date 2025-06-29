export type GeminiModel = 'gemini-1.5-flash'; // Add or remove models as needed ex. 'gemini-pro' | 'gemini-1.5-pro'
export interface TranslateBody {
  inputLanguage: string;
  outputLanguage: string;
  inputCode: string;
  model: GeminiModel;
  apiKey: string;
}
