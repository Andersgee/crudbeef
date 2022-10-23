import { useEffect, useState } from "react";
import type { Prisma } from "@prisma/client";

export type BeefWhere = Prisma.BeefWhereInput;

type Props = {
  onChange?: (where: BeefWhere) => void;
};

export function Filter({ onChange }: Props) {
  //const { mutate, isLoading, error } = trpc.beef.create.useMutation({ onSuccess: (data) => onCreated(data) });

  const [createdAtComparator, setCreatedAtComparator] = useState("pick...");
  const [createdAt, setCreatedAt] = useState<Date | undefined>(new Date());

  const [myFloatComparator, setMyFloatComparator] = useState("equals");
  const [myFloat, setMyFloat] = useState<number | undefined>(undefined);

  const [myIntComparator, setMyIntComparator] = useState("equals");
  const [myInt, setMyInt] = useState<number | undefined>(undefined);

  const [myStringComparator, setMyStringComparator] = useState("contains");
  const [myString, setMyString] = useState<string | undefined>(undefined);

  const [myOptionalStringComparator, setMyOptionalStringComparator] = useState("contains");
  const [myOptionalString, setMyOptionalString] = useState<string | undefined>(undefined);

  useEffect(() => {
    const where: BeefWhere = {
      createdAt:
        createdAt === undefined || createdAtComparator === "pick..." ? undefined : { [createdAtComparator]: createdAt },
      myFloat: myFloat === undefined ? undefined : { [myFloatComparator]: myFloat },
      myInt: myInt === undefined ? undefined : { [myIntComparator]: myInt },
      myString: myString === undefined ? undefined : { [myStringComparator]: myString },
      myOptionalString: myOptionalString === undefined ? undefined : { [myOptionalStringComparator]: myOptionalString },
    };
    onChange?.(where);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    createdAt,
    createdAtComparator,
    myFloat,
    myInt,
    myString,
    myOptionalString,
    myFloatComparator,
    myIntComparator,
    myStringComparator,
    myOptionalStringComparator,
  ]);

  return (
    <table>
      <tbody>
        <tr>
          <th>
            createdAt <br /> <SelectDateComparator onChange={setCreatedAtComparator} />
          </th>
          <th>
            myFloat <br /> <SelectNumberComparator onChange={setMyFloatComparator} />
          </th>
          <th>
            myInt <br />
            <SelectNumberComparator onChange={setMyIntComparator} />
          </th>
          <th>
            myString <br /> <SelectStringComparator onChange={setMyStringComparator} />
          </th>
          <th>
            myOptionalString <br /> <SelectStringComparator onChange={setMyOptionalStringComparator} />
          </th>
        </tr>
        <tr className="bg-neutral-100">
          <td>
            {createdAtComparator !== "pick..." && (
              <input
                pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                type="datetime-local"
                value={createdAt !== undefined ? datetimelocalString(createdAt) : undefined}
                onChange={(e) => {
                  if (e.target.value) {
                    setCreatedAt(new Date(e.target.value));
                  }
                }}
                className="w-[20ch]  border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40"
              />
            )}
          </td>
          <td>
            <input
              type="number"
              value={myFloat ?? ""}
              onChange={(e) => {
                const x = parseFloat(e.target.value);
                if (isFinite(x)) {
                  setMyFloat(x);
                } else {
                  setMyFloat(undefined);
                }
              }}
              className="w-[20ch]  border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40"
            />
          </td>
          <td>
            <input
              type="number"
              value={myInt ?? ""}
              onChange={(e) => {
                const x = parseInt(e.target.value, 10);
                if (isFinite(x)) {
                  setMyInt(x);
                } else {
                  setMyInt(undefined);
                }
              }}
              className="w-[20ch]  border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40"
            />
          </td>
          <td>
            <input
              type="text"
              value={myString ?? ""}
              onChange={(e) => {
                if (e.target.value) {
                  setMyString(e.target.value);
                } else {
                  setMyString(undefined);
                }
              }}
              className="w-[20ch]  border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40"
            />
          </td>
          <td>
            <input
              type="text"
              value={myOptionalString ?? ""}
              onChange={(e) => {
                if (e.target.value) {
                  setMyOptionalString(e.target.value);
                } else {
                  setMyOptionalString(undefined);
                }
              }}
              className="w-[20ch]  border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40"
            />
          </td>
          <td className="w-auto"></td>
        </tr>
      </tbody>
    </table>
  );
}

type SelectNumberComparatorProps = {
  onChange: (str: string) => void;
};

//Prisma.FloatFilter
const floatWhere = ["equals", "lt", "lte", "gt", "gte", "not"];

function SelectNumberComparator({ onChange }: SelectNumberComparatorProps) {
  return (
    <select name="property" defaultValue="equals" onChange={(e) => onChange(e.target.value)}>
      {floatWhere.map((x) => (
        <option key={x} value={x}>
          {x}
        </option>
      ))}
    </select>
  );
}

//Prisma.StringFilter
const stringWhere = ["contains", "equals", "startsWith", "endsWith", "not", "lt", "lte", "gt", "gte"];

type SelectStringComparatorProps = {
  onChange: (str: string) => void;
};

function SelectStringComparator({ onChange }: SelectStringComparatorProps) {
  return (
    <select name="property" defaultValue="contains" onChange={(e) => onChange(e.target.value)}>
      {stringWhere.map((x) => (
        <option key={x} value={x}>
          {x}
        </option>
      ))}
    </select>
  );
}

/*
type MyFloatWhere = Prisma.BeefWhereInput["myFloat"];
type MyStringWhere = Prisma.BeefWhereInput["myString"];
type IntFilter = Prisma.IntFilter;
*/

//Prisma.DateTimeFilter
const dateWhere = ["pick...", "equals", "lt", "lte", "gt", "gte", "not"];

type SelectDateComparatorProps = {
  onChange: (str: string) => void;
};

function SelectDateComparator({ onChange }: SelectDateComparatorProps) {
  return (
    <select name="property" defaultValue="pick..." onChange={(e) => onChange(e.target.value)}>
      {dateWhere.map((x) => (
        <option key={x} value={x}>
          {x}
        </option>
      ))}
    </select>
  );
}

/**
 * `<input type="datetime-local">` wants a particular string format in local time such as
 *
 * "2021-12-15T20:15"
 *
 * or
 *
 * "2021-12-15T20:15:34"
 *
 * which is almost just date.toISOString() but not quite.
 */
export function datetimelocalString(date: Date) {
  return localIsoString(date).slice(0, 16);
}

function localIsoString(d: Date) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
}
