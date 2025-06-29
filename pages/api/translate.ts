import { TranslateBody } from '@/types/types';
import { GeminiStream } from '@/utils/GeminiStream';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { inputLanguage, outputLanguage, inputCode, model, apiKey } =
      (await req.json()) as TranslateBody;

    const stream = await GeminiStream(
      inputLanguage,
      outputLanguage,
      inputCode,
      model,
      apiKey,
    );

    return new Response(stream);
  } catch (error: any) {
    console.error(error);
    return new Response(`Error: ${error.message || 'Something went wrong.'}`, { status: 500 });
  }
};

export default handler;
