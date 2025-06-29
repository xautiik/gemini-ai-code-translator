// components/ModelSelect.tsx
import { GeminiModel } from '@/types/types'; // Import GeminiModel
import { FC } from 'react';

interface Props {
  model: GeminiModel; // Use GeminiModel type
  onChange: (model: GeminiModel) => void; // Use GeminiModel type
}

export const ModelSelect: FC<Props> = ({ model, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as GeminiModel); // Cast to GeminiModel
  };

  return (
    <select
      className="h-[40px] w-[140px] rounded-md bg-[#1F2937] px-4 py-2 text-neutral-200"
      value={model}
      onChange={handleChange}
    >
      {/* Updated options to Gemini models */}
      <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
      <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
      <option value="gemini-pro">Gemini Pro</option>
    </select>
  );
};
