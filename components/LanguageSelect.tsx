import type { FC } from 'react';

interface Props {
  language: string;
  onChange: (language: string) => void;
}

export const LanguageSelect: FC<Props> = ({ language, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <select
      className="w-full px-3 py-2 text-sm text-white transition-colors border rounded-md shadow-sm outline-none border-neutral-700 bg-neutral-900 focus:border-primary focus:ring-1 focus:ring-primary"
      value={language}
      onChange={handleChange}
    >
      {languages
        .sort((a, b) => a.label.localeCompare(b.label))
        .map((language) => (
          <option
            key={language.value}
            value={language.value}
            className="text-white bg-neutral-900"
          >
            {language.label}
          </option>
        ))}
    </select>
  );
};

const languages = [
  { value: 'Pascal', label: 'Pascal' },
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'Python', label: 'Python' },
  { value: 'TSX', label: 'TSX' },
  { value: 'JSX', label: 'JSX' },
  { value: 'Vue', label: 'Vue' },
  { value: 'Go', label: 'Go' },
  { value: 'C', label: 'C' },
  { value: 'C++', label: 'C++' },
  { value: 'Java', label: 'Java' },
  { value: 'C#', label: 'C#' },
  { value: 'Visual Basic .NET', label: 'Visual Basic .NET' },
  { value: 'SQL', label: 'SQL' },
  { value: 'Assembly Language', label: 'Assembly Language' },
  { value: 'PHP', label: 'PHP' },
  { value: 'Ruby', label: 'Ruby' },
  { value: 'Swift', label: 'Swift' },
  { value: 'SwiftUI', label: 'SwiftUI' },
  { value: 'Kotlin', label: 'Kotlin' },
  { value: 'R', label: 'R' },
  { value: 'Objective-C', label: 'Objective-C' },
  { value: 'Perl', label: 'Perl' },
  { value: 'SAS', label: 'SAS' },
  { value: 'Scala', label: 'Scala' },
  { value: 'Dart', label: 'Dart' },
  { value: 'Rust', label: 'Rust' },
  { value: 'Haskell', label: 'Haskell' },
  { value: 'Lua', label: 'Lua' },
  { value: 'Groovy', label: 'Groovy' },
  { value: 'Elixir', label: 'Elixir' },
  { value: 'Clojure', label: 'Clojure' },
  { value: 'Lisp', label: 'Lisp' },
  { value: 'Julia', label: 'Julia' },
  { value: 'Matlab', label: 'Matlab' },
  { value: 'Fortran', label: 'Fortran' },
  { value: 'COBOL', label: 'COBOL' },
  { value: 'Bash', label: 'Bash' },
  { value: 'Powershell', label: 'Powershell' },
  { value: 'PL/SQL', label: 'PL/SQL' },
  { value: 'CSS', label: 'CSS' },
  { value: 'Racket', label: 'Racket' },
  { value: 'HTML', label: 'HTML' },
  { value: 'NoSQL', label: 'NoSQL' },
  { value: 'Natural Language', label: 'Natural Language' },
  { value: 'CoffeeScript', label: 'CoffeeScript' },
];
