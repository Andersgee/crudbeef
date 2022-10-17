import type { NextPage } from "next";
import { useState } from "react";
import { InputFloat, InputInt, InputText } from "../components/Input";
import { dateformat } from "../utils/date";
import { AppRouterTypes, trpc } from "../utils/trpc";

type Beef = NonNullable<AppRouterTypes["beef"]["read"]["output"]>;

const Home: NextPage = () => {
  const { data: beefs, refetch: refetchBeefs } = trpc.beef.readAll.useQuery();
  const { mutateAsync: createBeef } = trpc.beef.create.useMutation();
  const { mutateAsync: updateBeefs, isLoading: updateIsLoading } = trpc.beef.updateMultiple.useMutation();
  const { mutateAsync: deleteBeef, isLoading: deleteIsLoading } = trpc.beef.delete.useMutation();

  const [myFloat, setMyFloat] = useState(0);
  const [myInt, setMyInt] = useState(0);
  const [myString, setMyString] = useState("");
  const [myOptionalString, setMyOptionalString] = useState("");

  const [hasEditedIds, setHasEditedIds] = useState<string[]>([]);

  const [editedBeefs, setEditedBeefs] = useState<Beef[]>([]);

  const handleSave = async () => {
    await updateBeefs(editedBeefs);
    setHasEditedIds([]);
  };

  const handleEdit = (partialBeef: Partial<Beef>) => {
    if (!beefs || !partialBeef.id) return;
    const id = partialBeef.id;
    setHasEditedIds((prev) => [...prev, id]);

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
      <div>
        <h1>CRUD example</h1>
        <button disabled={updateIsLoading} onClick={handleSave}>
          save changes
        </button>
        <table className="">
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
                <InputFloat value={myFloat} onChange={setMyFloat} />
              </td>
              <td>
                <InputInt value={myInt} onChange={setMyInt} />
              </td>
              <td>
                <InputText value={myString} onChange={setMyString} />
              </td>
              <td>
                <InputText value={myOptionalString} onChange={setMyOptionalString} />
              </td>
              <td>
                {/*disabled={!sessionData?.user} */}
                <button
                  onClick={async () => {
                    await createBeef({ myFloat, myInt, myString, myOptionalString });
                    refetchBeefs();
                  }}
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
              const hasEdited = hasEditedIds.includes(beef.id);
              return (
                <tr
                  key={beef.id}
                  className={`${hasEdited ? "bg-orange-200 even:bg-orange-200" : "bg-neutral-100 even:bg-neutral-200"}`}
                >
                  <td>{dateformat(beef.createdAt)}</td>
                  <td>
                    <input
                      type="number"
                      className="bg-transparent"
                      defaultValue={beef.myFloat}
                      onChange={(e) => handleEdit({ id: beef.id, myFloat: parseFloat(e.target.value) })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="bg-transparent"
                      defaultValue={beef.myInt}
                      onChange={(e) => handleEdit({ id: beef.id, myInt: Math.floor(parseFloat(e.target.value)) })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="bg-transparent"
                      defaultValue={beef.myString}
                      onChange={(e) => handleEdit({ id: beef.id, myString: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="bg-transparent"
                      defaultValue={beef.myOptionalString || ""}
                      onChange={(e) => handleEdit({ id: beef.id, myOptionalString: e.target.value })}
                    />
                  </td>
                  <td>
                    <button
                      disabled={deleteIsLoading}
                      className="bg-red-600 px-2 py-1 font-semibold text-white disabled:bg-gray-500"
                      onClick={async () => {
                        await deleteBeef({ id: beef.id });
                        refetchBeefs();
                      }}
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
    </>
  );
};

export default Home;
