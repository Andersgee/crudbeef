import { Beef } from "@prisma/client";
import { trpc } from "../utils/trpc";

type Props = {
  id: string;
  onDeleted: (item: Beef) => void;
};

export function Delete({ id, onDeleted }: Props) {
  const { mutate, isLoading, error } = trpc.beef.delete.useMutation({ onSuccess: (data) => onDeleted(data) });

  const handleSubmit = () => mutate({ id });

  return (
    <>
      <button
        disabled={isLoading}
        onClick={handleSubmit}
        aria-label="delete"
        className="bg-red-600 px-2 py-1 font-semibold text-white disabled:bg-gray-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {error && <div>{error.message}</div>}
    </>
  );
}
