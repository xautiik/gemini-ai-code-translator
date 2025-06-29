import { APIKeyInput } from '@/components/APIKeyInput';
import { CodeBlock } from '@/components/CodeBlock';
import { LanguageSelect } from '@/components/LanguageSelect';
import { ModelSelect } from '@/components/ModelSelect';
import { TextBlock } from '@/components/TextBlock';
// Removed OpenAIModel as it's specific to OpenAI.
import { TranslateBody, GeminiModel } from '@/types/types'; // Import GeminiModel from types/types.ts
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Home() {
  const [inputLanguage, setInputLanguage] = useState<string>('JavaScript');
  const [outputLanguage, setOutputLanguage] = useState<string>('Python');
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  // Changed the type and initial value to a Gemini model
  const [model, setModel] = useState<GeminiModel>('gemini-1.5-flash'); // Using a modern Gemini model
  const [loading, setLoading] = useState<boolean>(false);
  const [hasTranslated, setHasTranslated] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');

  const handleTranslate = async () => {
    // Adjust maxCodeLength based on Gemini model capabilities.
    // Gemini 1.5 Flash and Pro have very large context windows.
    // Setting a generous but still practical limit.
    const maxCodeLength = 100000; // Increased limit for Gemini models

    if (!apiKey) {
      // Replaced alert with a custom message box or toast notification in a real app
      // For this example, keeping alert for direct replacement.
      alert('Please enter a Gemini API key.');
      return;
    }

    if (inputLanguage === outputLanguage) {
      alert('Please select different languages for translation.');
      return;
    }

    if (!inputCode) {
      alert('Please enter some code or natural language to translate.');
      return;
    }

    if (inputCode.length > maxCodeLength) {
      alert(
        `Please enter input less than ${maxCodeLength} characters. You are currently at ${inputCode.length} characters.`,
      );
      return;
    }

    setLoading(true);
    setOutputCode('');

    const controller = new AbortController();

    const body: TranslateBody = {
      inputLanguage,
      outputLanguage,
      inputCode,
      model,
      apiKey,
    };

    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setLoading(false);
      const errorText = await response.text(); // Get specific error message from API route
      alert(`Translation failed: ${errorText}`);
      return;
    }

    const data = response.body;

    if (!data) {
      setLoading(false);
      alert('No response data received.');
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let code = '';

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      code += chunkValue;

      setOutputCode((prevCode) => prevCode + chunkValue);
    }

    setLoading(false);
    setHasTranslated(true);
    copyToClipboard(code);
  };

  const copyToClipboard = (text: string) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    localStorage.setItem('geminiApiKey', value); // Store with a Gemini-specific key
  };

  useEffect(() => {
    // Re-evaluate if this behavior is desired for re-translation on outputLanguage change
    // If you only want it to translate on button click, you might remove this useEffect.
    if (hasTranslated && outputCode) { // Add outputCode to dependency to prevent loop on initial render
      handleTranslate();
    }
  }, [outputLanguage]); // Dependency array: run when outputLanguage changes

  useEffect(() => {
    const apiKey = localStorage.getItem('geminiApiKey'); // Retrieve with Gemini-specific key

    if (apiKey) {
      setApiKey(apiKey);
    }
  }, []); // Empty dependency array: run once on component mount

  return (
    <>
      <Head>
        <title>Gemini Code Translator</title> {/* Updated title */}
        <meta
          name="description"
          content="Use Google Gemini AI to translate code from one language to another." // Updated description
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-full min-h-screen flex-col items-center bg-[#0E1117] px-4 pb-20 text-neutral-200 sm:px-10">
        <div className="mt-10 flex flex-col items-center justify-center sm:mt-20">
          <div className="text-4xl font-bold">AI Code Translator</div>
        </div>

        <div className="mt-6 text-center text-sm">
          <APIKeyInput apiKey={apiKey} onChange={handleApiKeyChange} />
        </div>

        <div className="mt-2 flex items-center space-x-2">
          {/* Ensure ModelSelect component can handle GeminiModel type */}
          <ModelSelect model={model} onChange={(value) => setModel(value as GeminiModel)} />

          <button
            className="w-[140px] cursor-pointer rounded-md bg-violet-500 px-4 py-2 font-bold hover:bg-violet-600 active:bg-violet-700"
            onClick={() => handleTranslate()}
            disabled={loading}
          >
            {loading ? 'Translating...' : 'Translate'}
          </button>
        </div>

        <div className="mt-2 text-center text-xs">
          {loading
            ? 'Translating...'
            : hasTranslated
            ? 'Output copied to clipboard!'
            : 'Enter some code and click "Translate"'}
        </div>

        <div className="mt-6 flex w-full max-w-[1200px] flex-col justify-between sm:flex-row sm:space-x-4">
          <div className="h-100 flex flex-col justify-center space-y-2 sm:w-2/4">
            <div className="text-center text-xl font-bold">Input</div>

            <LanguageSelect
              language={inputLanguage}
              onChange={(value) => {
                setInputLanguage(value);
                setHasTranslated(false);
                setInputCode('');
                setOutputCode('');
              }}
            />

            {inputLanguage === 'Natural Language' ? (
              <TextBlock
                text={inputCode}
                editable={!loading}
                onChange={(value) => {
                  setInputCode(value);
                  setHasTranslated(false);
                }}
              />
            ) : (
              <CodeBlock
                code={inputCode}
                editable={!loading}
                onChange={(value) => {
                  setInputCode(value);
                  setHasTranslated(false);
                }}
              />
            )}
          </div>
          <div className="mt-8 flex h-full flex-col justify-center space-y-2 sm:mt-0 sm:w-2/4">
            <div className="text-center text-xl font-bold">Output</div>

            <LanguageSelect
              language={outputLanguage}
              onChange={(value) => {
                setOutputLanguage(value);
                setOutputCode('');
              }}
            />

            {outputLanguage === 'Natural Language' ? (
              <TextBlock text={outputCode} />
            ) : (
              <CodeBlock code={outputCode} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
