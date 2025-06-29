interface Props {
  apiKey: string;
  onChange: (apiKey: string) => void;
}

export const APIKeyInput: React.FC<Props> = ({ apiKey, onChange }) => {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <label
        htmlFor="api-key"
        className="text-sm font-medium text-neutral-300"
      >
        GeminiAI API Key
      </label>
      <input
        id="api-key"
        type="password"
        placeholder="Enter your API key"
        value={apiKey}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 py-2 text-sm text-white border rounded-md shadow-sm outline-none border-neutral-700 bg-neutral-900 placeholder:text-neutral-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
      />
    </div>
  );
};
