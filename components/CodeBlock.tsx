import { StreamLanguage } from '@codemirror/language';
import { go } from '@codemirror/legacy-modes/mode/go';
import { gruvboxDark } from '@uiw/codemirror-theme-gruvbox-dark';
import CodeMirror from '@uiw/react-codemirror';
import { FC, useEffect, useState } from 'react';

interface Props {
  code: string;
  editable?: boolean;
  onChange?: (value: string) => void;
}

export const CodeBlock: FC<Props> = ({
  code,
  editable = false,
  onChange = () => {},
}) => {
  const [copyText, setCopyText] = useState<string>('Copy');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCopyText('Copy');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [copyText]);

  return (
    <div className="relative border rounded-md shadow-sm border-neutral-700 bg-neutral-900">
      <button
        className="absolute z-10 px-2 py-1 text-xs font-medium text-white transition-colors border rounded right-2 top-2 border-neutral-700 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopyText('Copied!');
        }}
      >
        {copyText}
      </button>

      <CodeMirror
        editable={editable}
        value={code}
        minHeight="500px"
        extensions={[StreamLanguage.define(go)]}
        theme={gruvboxDark}
        onChange={(value) => onChange(value)}
        className="rounded-b-md"
      />
    </div>
  );
};
