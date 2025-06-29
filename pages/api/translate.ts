import { TranslateBody } from '@/types/types';
import { GeminiStream } from '@/utils/GeminiStream'; // Updated import path to point to the new GeminiStream file

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { inputLanguage, outputLanguage, inputCode, model, apiKey } =
      (await req.json()) as TranslateBody;

    // Call the GeminiStream function instead of OpenAIStream
    const stream = await GeminiStream(
      inputLanguage,
      outputLanguage,
      inputCode,
      model,
      apiKey,
    );

    return new Response(stream);
  } catch (error: any) { // Explicitly type error as any for safer access to properties
    console.error(error);
    return new Response(`Error: ${error.message || 'Something went wrong.'}`, { status: 500 });
  }
};

export default handler;
