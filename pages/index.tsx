import { APIKeyInput } from '@/components/APIKeyInput';
import { CodeBlock } from '@/components/CodeBlock';
import { LanguageSelect } from '@/components/LanguageSelect';
import { ModelSelect } from '@/components/ModelSelect';
import { TextBlock } from '@/components/TextBlock';
import { TranslateBody, GeminiModel } from '@/types/types';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Home() {
  const [inputLanguage, setInputLanguage] = useState<string>('JavaScript');
  const [outputLanguage, setOutputLanguage] = useState<string>('Python');
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [model, setModel] = useState<GeminiModel>('gemini-1.5-flash');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasTranslated, setHasTranslated] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');

  const handleTranslate = async () => {
    const maxCodeLength = 100000;

    if (!apiKey) {
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
      const errorText = await response.text();
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
    localStorage.setItem('geminiApiKey', value);
  };

  useEffect(() => {
    if (hasTranslated && outputCode) { 
      handleTranslate();
    }
  }, [outputLanguage]);

  useEffect(() => {
    const apiKey = localStorage.getItem('geminiApiKey');

    if (apiKey) {
      setApiKey(apiKey);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Gemini Code Translator</title>
        <meta
          name="description"
          content="Use Google Gemini AI to translate code from one language to another."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="flex h-full min-h-screen flex-col items-center bg-[#0E1117] px-4 pb-20 text-neutral-200 sm:px-10">
        <div className="flex flex-col items-center justify-center mt-10 sm:mt-20">
          <div className="text-4xl font-bold">Gemini-AI Code Translator</div>
        </div>

        <div className="mt-6 text-sm text-center">
          <APIKeyInput apiKey={apiKey} onChange={handleApiKeyChange} />
        </div>

        <div className="flex items-center mt-2 space-x-2">
          <ModelSelect model={model} onChange={(value) => setModel(value as GeminiModel)} />

          <button
          className="w-[140px] rounded-md border border-violet-600 bg-violet-600/10 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-600 hover:text-white active:bg-violet-700 disabled:opacity-50 disabled:pointer-events-none transition-colors duration-200 ease-in-out"
            onClick={() => handleTranslate()}
            disabled={loading}
          >
            {loading ? 'Translating...' : 'Translate'}
          </button>
        </div>

        <div className="mt-2 text-xs text-center">
          {loading
            ? 'Translating...'
            : hasTranslated
            ? 'Done Translating!'
            : ' '}
        </div>

        <div className="mt-6 flex w-full max-w-[1200px] flex-col justify-between sm:flex-row sm:space-x-4">
          <div className="flex flex-col justify-center space-y-2 h-100 sm:w-2/4">
            <div className="text-xl font-bold text-center">Input</div>

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
          <div className="flex flex-col justify-center h-full mt-8 space-y-2 sm:mt-0 sm:w-2/4">
            <div className="text-xl font-bold text-center">Output</div>

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
