type InputTextProps = {
  value: string;
  onChange: (string: string) => void;
};

export function InputText({ value, onChange }: InputTextProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full max-w-lg rounded-lg border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40"
    />
  );
}

type InputFloatProps = {
  value: number;
  onChange: (number: number) => void;
};

export function InputFloat({ value, onChange }: InputFloatProps) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => {
        const x = parseFloat(e.target.value);
        if (isFinite(x)) {
          onChange(x);
        }
      }}
      className="w-full max-w-[200px] rounded-lg border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40"
    />
  );
}

type InputIntProps = {
  value: number;
  onChange: (number: number) => void;
};

export function InputInt({ value, onChange }: InputIntProps) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => {
        const x = parseInt(e.target.value, 10);
        if (isFinite(x)) {
          onChange(x);
        }
      }}
      className="w-full max-w-[200px] rounded-lg border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40"
    />
  );
}
