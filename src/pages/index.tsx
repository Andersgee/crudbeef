import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { dateformat } from "../utils/date";
import { AppRouterTypes, trpc } from "../utils/trpc";

type Beef = NonNullable<AppRouterTypes["beef"]["read"]["output"]>;

const inputStyle =
  "w-[20ch] rounded-sm border border-slate-200 bg-transparent px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40";

/** Changing a key triggers a rerender (modify this to reset defaultValues) */
let tableKey = 0;

const Home: NextPage = () => {
  const { data: beefs, refetch: refetchBeefs } = trpc.beef.readAll.useQuery();
  const { mutateAsync: createBeef, isLoading: createIsLoading } = trpc.beef.create.useMutation();
  const { mutateAsync: updateBeefs, isLoading: updateIsLoading } = trpc.beef.updateMultiple.useMutation();
  const { mutateAsync: deleteBeef, isLoading: deleteIsLoading } = trpc.beef.delete.useMutation();

  const [myFloat, setMyFloat] = useState(0);
  const [myInt, setMyInt] = useState(0);
  const [myString, setMyString] = useState("");
  const [myOptionalString, setMyOptionalString] = useState("");

  const [editedBeefs, setEditedBeefs] = useState<Beef[]>([]);

  const handleCreate = async () => {
    await createBeef({ myFloat, myInt, myString, myOptionalString });
    refetchBeefs();
    setEditedBeefs([]);
    tableKey += 1;
  };

  const handleDelete = async (id: string) => {
    await deleteBeef({ id });
    refetchBeefs();
    setEditedBeefs((prev) => prev.filter((b) => b.id !== id));
    tableKey += 1;
  };

  const handleSaveChanges = async () => {
    await updateBeefs(editedBeefs);
    await refetchBeefs();
    setEditedBeefs([]);
    tableKey += 1;
  };

  const handleDiscardChanges = async () => {
    await refetchBeefs();
    setEditedBeefs([]);
    tableKey += 1;
  };

  const handleEdit = (partialBeef: Partial<Beef>) => {
    if (!beefs || !partialBeef.id) return;
    const id = partialBeef.id;

    const dbBeef = beefs.find((beef) => beef.id === id);
    if (!dbBeef) return;

    const editedBeef = editedBeefs.find((beef) => beef.id === id);
    if (editedBeef) {
      //has already edited this a bit, update it instead of adding a new editedBeef
      const updatedBeef = { ...editedBeef, ...partialBeef };
      const updatedBeefs = [...editedBeefs.filter((b) => b.id !== id), updatedBeef];
      setEditedBeefs(updatedBeefs);
    } else {
      //start editing a new, add new editedBeef
      const updatedBeef = { ...dbBeef, ...partialBeef };
      setEditedBeefs((prev) => [...prev, updatedBeef]);
    }
  };

  return (
    <>
      <Head>
        <title>crudbeef</title>
      </Head>
      <div className="flex justify-center">
        <div>
          <h1 className="my-8 text-center text-4xl">crudbeef example</h1>
          <button
            disabled={editedBeefs.length === 0 || updateIsLoading}
            onClick={handleSaveChanges}
            className={`px-2 py-1 ${editedBeefs.length > 0 ? "bg-green-600" : ""} disabled:bg-neutral-400`}
          >
            save changes
          </button>

          <button
            disabled={editedBeefs.length === 0}
            onClick={handleDiscardChanges}
            className={`px-2 py-1 ${editedBeefs.length > 0 ? "bg-blue-600" : ""} disabled:bg-neutral-400`}
          >
            discard changes
          </button>

          <table className="" key={tableKey}>
            <tbody>
              <tr>
                <th>createdAt</th>
                <th>myFloat</th>
                <th>myInt</th>
                <th>myString</th>
                <th>myOptionalString</th>
              </tr>
              <tr>
                <td> </td>
                <td>
                  <input
                    type="number"
                    value={myFloat}
                    onChange={(e) => {
                      const number = parseFloat(e.target.value);
                      if (isFinite(number)) setMyFloat(number);
                    }}
                    className={inputStyle}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={myInt}
                    onChange={(e) => {
                      const number = parseFloat(e.target.value);
                      if (isFinite(number)) setMyInt(Math.floor(number));
                    }}
                    className={inputStyle}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={myString}
                    onChange={(e) => {
                      setMyString(e.target.value);
                    }}
                    className={inputStyle}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={myOptionalString}
                    onChange={(e) => {
                      setMyOptionalString(e.target.value);
                    }}
                    className={inputStyle}
                  />
                </td>
                <td>
                  <button
                    disabled={createIsLoading}
                    onClick={handleCreate}
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
                </td>
              </tr>

              {beefs?.map((beef) => {
                const hasEdited = editedBeefs.some((b) => b.id === beef.id);
                return (
                  <tr
                    key={beef.id}
                    className={`${
                      hasEdited ? "bg-orange-200 even:bg-orange-200" : "bg-neutral-100 even:bg-neutral-200"
                    }`}
                  >
                    <td>{dateformat(beef.createdAt)}</td>
                    <td>
                      <input
                        type="number"
                        className={inputStyle}
                        defaultValue={beef.myFloat}
                        onChange={(e) => {
                          const number = parseFloat(e.target.value);
                          if (isFinite(number)) {
                            handleEdit({ id: beef.id, myFloat: number });
                          }
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className={inputStyle}
                        defaultValue={beef.myInt}
                        onChange={(e) => {
                          const number = Math.floor(parseFloat(e.target.value));

                          if (isFinite(number)) {
                            console.log("triggered handleEdit with myInt:", number);
                            handleEdit({ id: beef.id, myInt: number });
                          }
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={inputStyle}
                        defaultValue={beef.myString}
                        onChange={(e) => handleEdit({ id: beef.id, myString: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={inputStyle}
                        defaultValue={beef.myOptionalString || undefined}
                        onChange={(e) => handleEdit({ id: beef.id, myOptionalString: e.target.value })}
                      />
                    </td>
                    <td>
                      <button
                        disabled={deleteIsLoading}
                        className="bg-red-600 px-2 py-1 font-semibold text-white disabled:bg-gray-500"
                        onClick={() => handleDelete(beef.id)}
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Home;
