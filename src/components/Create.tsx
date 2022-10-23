import { Beef } from "@prisma/client";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { InputFloat, InputInt, InputText } from "./Input";

type Props = {
  onCreated: (item: Beef) => void;
};

export function Create({ onCreated }: Props) {
  const { mutate, isLoading, error } = trpc.beef.create.useMutation({ onSuccess: (data) => onCreated(data) });

  const [myFloat, setMyFloat] = useState(0);
  const [myInt, setMyInt] = useState(0);
  const [myString, setMyString] = useState("");
  const [myOptionalString, setMyOptionalString] = useState("");

  const handleSubmit = () => mutate({ myFloat, myInt, myString, myOptionalString });

  return (
    <tr className="bg-neutral-100">
      <td></td>
      <td>
        <InputFloat label="myFloat" value={myFloat} onChange={setMyFloat} />
      </td>
      <td>
        <InputInt label="myInt" value={myInt} onChange={setMyInt} />
      </td>
      <td>
        <InputText label="myString" value={myString} onChange={setMyString} />
      </td>
      <td>
        <InputText label="myOptionalString" value={myOptionalString} onChange={setMyOptionalString} />
      </td>
      <td className="w-auto">
        <button
          disabled={isLoading}
          onClick={handleSubmit}
          aria-label="create"
          className="bg-blue-600 px-2 py-1 font-semibold text-white disabled:bg-gray-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
        {error && error.message}
      </td>
    </tr>
  );
}
