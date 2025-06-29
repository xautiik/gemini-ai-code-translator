import { GeminiModel } from '@/types/types';
import { FC } from 'react';

interface Props {
  model: GeminiModel;
  onChange: (model: GeminiModel) => void;
}

export const ModelSelect: FC<Props> = ({ model, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as GeminiModel);
  };

  return (
    <select
      value={model}
      onChange={handleChange}
      className="h-[40px] w-[160px] rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white shadow-sm outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
    >
      <option value="gemini-1.5-flash" className="text-white bg-neutral-900">
        Gemini 1.5 Flash
      </option>
    </select>
  );
};
