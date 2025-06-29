import endent from 'endent';
import { GoogleGenerativeAI } from '@google/generative-ai';

const createPrompt = (
  inputLanguage: string,
  outputLanguage: string,
  inputCode: string,
) => {
  if (inputLanguage === 'Natural Language') {
    return endent`
    You are an expert programmer in all programming languages. Translate the natural language to "${outputLanguage}" code. Do not include \`\`\`.

    Example translating from natural language to JavaScript:

    Natural language:
    Print the numbers 0 to 9.

    JavaScript code:
    for (let i = 0; i < 10; i++) {
      console.log(i);
    }

    Natural language:
    ${inputCode}

    ${outputLanguage} code (no \`\`\`):
    `;
  } else if (outputLanguage === 'Natural Language') {
    return endent`
      You are an expert programmer in all programming languages. Translate the "${inputLanguage}" code to natural language in plain English that the average adult could understand. Respond as bullet points starting with -.
  
      Example translating from JavaScript to natural language:
  
      JavaScript code:
      for (let i = 0; i < 10; i++) {
        console.log(i);
      }
  
      Natural language:
      Print the numbers 0 to 9.
      
      ${inputLanguage} code:
      ${inputCode}

      Natural language:
     `;
  } else {
    return endent`
      You are an expert programmer in all programming languages. Translate the "${inputLanguage}" code to "${outputLanguage}" code. Do not include \`\`\`.
  
      Example translating from JavaScript to Python:
  
      JavaScript code:
      for (let i = 0; i < 10; i++) {
        console.log(i);
      }
  
      Python code:
      for i in range(10):
        print(i)
      
      ${inputLanguage} code:
      ${inputCode}

      ${outputLanguage} code (no \`\`\`):
     `;
  }
};

export const GeminiStream = async (
  inputLanguage: string,
  outputLanguage: string,
  inputCode: string,
  model: string,
  key: string,
) => {
  const prompt = createPrompt(inputLanguage, outputLanguage, inputCode);

  const genAI = new GoogleGenerativeAI(key || process.env.GEMINI_API_KEY!);
 
  const geminiModel = genAI.getGenerativeModel({ model });

  try {
    const result = await geminiModel.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          const queue = encoder.encode(text);
          controller.enqueue(queue);
        }
        controller.close();
      },
    });

    return stream;
  } catch (e: any) {
    console.error("Error from Gemini API:", e);
    throw new Error(`Gemini API returned an error: ${e.message || 'Unknown error occurred.'}`);
  }
};
