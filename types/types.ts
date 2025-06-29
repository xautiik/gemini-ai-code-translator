export type GeminiModel = 'gemini-pro' | 'gemini-1.5-flash' | 'gemini-1.5-pro'; // Add or remove models as needed

// TranslateBody uses GeminiModel now
export interface TranslateBody {
  inputLanguage: string;
  outputLanguage: string;
  inputCode: string;
  model: GeminiModel; // Changed from OpenAIModel
  apiKey: string;
}
