import endent from 'endent';
import { GoogleGenerativeAI } from '@google/generative-ai';

// No need for eventsource-parser with the Google Generative AI SDK for streaming
// import {
//   createParser,
//   ParsedEvent,
//   ReconnectInterval,
// } from 'eventsource-parser';

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
  model: string, // This will be 'gemini-pro', 'gemini-1.5-flash', etc.
  key: string,
) => {
  const prompt = createPrompt(inputLanguage, outputLanguage, inputCode);

  // Initialize the GoogleGenerativeAI client
  // The API key is passed directly to the constructor
  const genAI = new GoogleGenerativeAI(key || process.env.GEMINI_API_KEY!);
  
  // Get the generative model
  const geminiModel = genAI.getGenerativeModel({ model });

  try {
    // Send the content to the Gemini model for streaming response
    const result = await geminiModel.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      // You can add generationConfig here for more control over the output
      // For example, to control randomness:
      // generationConfig: {
      //   temperature: 0.1, // Lower temperature for more deterministic output
      //   topP: 0.9,
      //   topK: 1,
      // },
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        // Iterate over the chunks from the Gemini API stream
        for await (const chunk of result.stream) {
          const text = chunk.text();
          // Encode the text and enqueue it to the ReadableStream
          const queue = encoder.encode(text);
          controller.enqueue(queue);
        }
        // Close the stream when done
        controller.close();
      },
    });

    return stream;
  } catch (e: any) { // Type 'e' as 'any' to safely access 'message'
    console.error("Error from Gemini API:", e);
    // Throw a more descriptive error if possible
    throw new Error(`Gemini API returned an error: ${e.message || 'Unknown error occurred.'}`);
  }
};
