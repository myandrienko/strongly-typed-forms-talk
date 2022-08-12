export interface TextInputProps {
  value: string;
  maxLength?: number;
  onChange: (value: string) => void;
}

export function TextInput({ value, onChange }: TextInputProps) {
  return <input value={value} onChange={(e) => onChange(e, e.target.value)} />;
}
