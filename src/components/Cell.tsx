import { useRef, useState } from "react";
import useOnClickOutside from "../hooks/useOnClickOutside";

type CellTextProps = {
  defaultValue: string;
  onChange: (string: string) => void;
};

export function CellText({ defaultValue, onChange }: CellTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(ref, () => {
    if (isEditing) {
      setIsEditing(false);
    }
  });

  if (isEditing) {
    return (
      <td>
        <input
          ref={ref}
          type="text"
          defaultValue={defaultValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-[20ch]  border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40"
        />
      </td>
    );
  }
  return <td onClick={() => setIsEditing(true)}>{defaultValue}</td>;
}

type CellFloatProps = {
  defaultValue: number;
  onChange: (number: number) => void;
};

export function CellFloat({ defaultValue, onChange }: CellFloatProps) {
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(ref, () => {
    if (isEditing) {
      setIsEditing(false);
    }
  });

  if (isEditing) {
    return (
      <td>
        <input
          ref={ref}
          type="number"
          defaultValue={defaultValue}
          onChange={(e) => {
            const x = parseFloat(e.target.value);
            if (isFinite(x)) {
              onChange(x);
            }
          }}
          className="w-[20ch]  border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40"
        />
      </td>
    );
  }

  return <td onClick={() => setIsEditing(true)}>{defaultValue}</td>;
}

type CellIntProps = {
  defaultValue: number;
  onChange: (number: number) => void;
};

export function CellInt({ defaultValue, onChange }: CellIntProps) {
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(ref, () => {
    if (isEditing) {
      setIsEditing(false);
    }
  });

  if (isEditing) {
    return (
      <td>
        <input
          ref={ref}
          type="number"
          defaultValue={defaultValue}
          onChange={(e) => {
            const x = parseInt(e.target.value, 10);
            if (isFinite(x)) {
              onChange(x);
            }
          }}
          className="w-[20ch]  border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40"
        />
      </td>
    );
  }

  return <td onClick={() => setIsEditing(true)}>{defaultValue}</td>;
}
