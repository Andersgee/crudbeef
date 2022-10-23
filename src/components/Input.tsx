import { useId } from "react";

type InputTextProps = {
  label: string;
  value: string;
  onChange: (string: string) => void;
};

export function InputTextWithLabel({ label, value, onChange }: InputTextProps) {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-[20ch]  border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40"
      />
    </>
  );
}

export function InputText({ value, onChange }: InputTextProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-[20ch]  border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40"
    />
  );
}

type InputFloatProps = {
  label: string;
  value: number;
  onChange: (number: number) => void;
};

export function InputFloatWithLabel({ label, value, onChange }: InputFloatProps) {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        value={value}
        onChange={(e) => {
          const x = parseFloat(e.target.value);
          if (isFinite(x)) {
            onChange(x);
          }
        }}
        className="w-[20ch]  border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40"
      />
    </>
  );
}

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
      className="w-[20ch]  border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40"
    />
  );
}

type InputIntProps = {
  label: string;
  value: number;
  onChange: (number: number) => void;
};

export function InputIntWithLabel({ label, value, onChange }: InputIntProps) {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        value={value}
        onChange={(e) => {
          const x = parseInt(e.target.value, 10);
          if (isFinite(x)) {
            onChange(x);
          }
        }}
        className="w-[20ch]  border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40"
      />
    </>
  );
}

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
      className="w-[20ch]  border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40"
    />
  );
}
