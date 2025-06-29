interface Props {
  text: string;
  editable?: boolean;
  onChange?: (value: string) => void;
}

export const TextBlock: React.FC<Props> = ({
  text,
  editable = false,
  onChange = () => {},
}) => {
  return (
    <textarea
      className="min-h-[500px] w-full rounded-md border border-neutral-700 bg-neutral-900 p-4 text-[15px] text-white shadow-sm placeholder:text-neutral-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-none transition-colors"
      value={text}
      onChange={(e) => onChange(e.target.value)}
      disabled={!editable}
      placeholder={editable ? "Start typing..." : undefined}
    />
  );
};
