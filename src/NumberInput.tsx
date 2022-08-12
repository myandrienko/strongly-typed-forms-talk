export interface NumberInputProps {
  value: number | null;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export function NumberInput({ value, onChange }: NumberInputProps) {
  return (
    <input
      value={value ?? ""}
      onChange={(e) => onChange(Number.parseInt(e.target.value, 10))}
    />
  );
}
