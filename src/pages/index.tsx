import { Beef } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { CellFloat, CellInt, CellText } from "../components/Cell";
import { Chevron } from "../components/Chevron";
import { Create } from "../components/Create";
import { Delete } from "../components/Delete";
import { BeefWhere, Filter } from "../components/Filter";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { dateformat } from "../utils/date";
import { trpc } from "../utils/trpc";

type Order = "asc" | "desc";
export type BeefProp = Exclude<keyof Beef, "id">;

function stringparam(p: string | string[] | undefined) {
  return typeof p === "string" ? p : undefined;
}

/** Changing a key triggers a rerender (modify this to reset defaultValues) */
let tableKey = 0;

/**
 * remove {someKey:undefined} or {someKey: ""} for a clean query url
 */
function cleanQuery(q: { [x: string]: string | string[] | undefined }) {
  const cleanQ: Record<string, string> = {};
  Object.entries(q).forEach(([k, v]) => {
    if (v && typeof v === "string") {
      cleanQ[k] = v;
    }
  });
  if (!cleanQ["contains"]) {
    delete cleanQ["containsBy"];
  }

  return cleanQ;
}

const Page: NextPage = () => {
  const router = useRouter();
  const updateMultiple = trpc.beef.updateMultiple.useMutation();

  const ref = useRef(null);
  const entry = useIntersectionObserver(ref, { freezeOnceVisible: false });
  const loadMoreIsInView = !!entry?.isIntersecting;

  const [where, setWhere] = useState<BeefWhere>({});
  const order = (stringparam(router.query.order) as Order) || "desc";
  const orderBy = (stringparam(router.query.orderBy) as BeefProp) || "createdAt";

  const query = trpc.beef.infiniteBeefs.useInfiniteQuery(
    {
      limit: 50,
      orderBy,
      order,
      where,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  useEffect(() => {
    if (loadMoreIsInView && query.hasNextPage && query.fetchNextPage) {
      query.fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadMoreIsInView]);

  const editQuery = (q: Record<string, string>) => {
    router.push({
      query: cleanQuery({ ...router.query, ...q }),
    });
  };

  const handleSort = (prop: BeefProp) => () => {
    const q = { orderBy: prop, order: order === "asc" ? "desc" : "asc" };
    editQuery(q);
  };

  const [editedItems, setEditedItems] = useState<Beef[]>([]);

  const handleEdit = (partialItem: Partial<Beef>) => {
    if (!partialItem.id) return;

    const editedItem = editedItems.find((item) => item.id === partialItem.id);

    if (editedItem) {
      //already edited this some. update it instead of adding it to the list
      const modifiedItem = { ...editedItem, ...partialItem };
      setEditedItems((prev) => [...prev.filter((b) => b.id !== modifiedItem.id), modifiedItem]);
      return;
    }

    const originalItem = query.data?.pages
      .map((page) => page.items)
      .flat()
      .find((item) => item.id === partialItem.id);

    if (originalItem) {
      const modifiedItem = { ...originalItem, ...partialItem };
      setEditedItems((prev) => [...prev, modifiedItem]);
      return;
    }
  };

  const handleSave = async () => {
    await updateMultiple.mutateAsync(editedItems);
    await query.refetch();
    setEditedItems([]);
    tableKey += 1;
  };

  const handleDiscard = () => {
    setEditedItems([]);
    tableKey += 1;
  };

  return (
    <>
      <Head>
        <title>crudbeef</title>
      </Head>
      <div className="flex justify-center">
        <div>
          <h1 className="my-8 text-center text-4xl">crudbeef example</h1>
          <div>
            <button
              disabled={editedItems.length < 1}
              onClick={handleSave}
              className={`px-2 py-1 ${editedItems.length > 0 ? "bg-green-600" : ""} disabled:bg-neutral-400`}
            >
              save changes
            </button>
            <button
              disabled={editedItems.length < 1}
              onClick={handleDiscard}
              className={`px-2 py-1 ${editedItems.length > 0 ? "bg-blue-600" : ""} disabled:bg-neutral-400`}
            >
              discard changes
            </button>
            {editedItems.length > 0 && <span>({editedItems.length} changed items)</span>}
          </div>

          <h2 className="mt-4">Filter</h2>
          <Filter onChange={(w) => setWhere(w)} />

          <h2 className="mt-4">Editable Table</h2>
          <table className="" key={tableKey}>
            <tbody>
              <tr>
                <th>
                  <button onClick={handleSort("createdAt")} className="inline-flex">
                    createdAt <Chevron dir={orderBy !== "createdAt" ? undefined : order} />
                  </button>
                </th>

                <th>
                  <button onClick={handleSort("myFloat")} className="inline-flex">
                    myFloat <Chevron dir={orderBy !== "myFloat" ? undefined : order} />
                  </button>
                </th>
                <th>
                  <button onClick={handleSort("myInt")} className="inline-flex">
                    myInt <Chevron dir={orderBy !== "myInt" ? undefined : order} />
                  </button>
                </th>
                <th>
                  <button onClick={handleSort("myString")} className="inline-flex">
                    myString <Chevron dir={orderBy !== "myString" ? undefined : order} />
                  </button>
                </th>
                <th>
                  <button onClick={handleSort("myOptionalString")} className="inline-flex">
                    myOptionalString <Chevron dir={orderBy !== "myOptionalString" ? undefined : order} />
                  </button>
                </th>
              </tr>
              <Create onCreated={() => query.refetch()} />

              {query.data?.pages
                .map((page) => page.items)
                .flat()
                .map((item) => {
                  const hasEdited = editedItems.some((x) => x.id === item.id);
                  const editedItem = editedItems.find((x) => x.id === item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`${
                        hasEdited ? "bg-orange-200 even:bg-orange-200" : "bg-neutral-100 even:bg-neutral-200"
                      }`}
                    >
                      <td>{dateformat(item.createdAt)}</td>

                      <CellFloat
                        defaultValue={editedItem?.myFloat ?? item.myFloat}
                        onChange={(x) => handleEdit({ id: item.id, myFloat: x })}
                      />
                      <CellInt
                        defaultValue={editedItem?.myInt ?? item.myInt}
                        onChange={(x) => handleEdit({ id: item.id, myInt: x })}
                      />
                      <CellText
                        defaultValue={editedItem?.myString ?? item.myString}
                        onChange={(x) => handleEdit({ id: item.id, myString: x })}
                      />
                      <CellText
                        defaultValue={editedItem?.myOptionalString ?? (item.myOptionalString || "")}
                        onChange={(x) => handleEdit({ id: item.id, myOptionalString: x })}
                      />
                      <td className="w-auto">
                        <Delete
                          id={item.id}
                          onDeleted={async (item) => {
                            setEditedItems((prev) => prev.filter((x) => x.id !== item.id));
                            await query.refetch();
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <div className="flex justify-center">
            <div>
              <button
                ref={ref}
                onClick={() => query.fetchNextPage()}
                disabled={!query.hasNextPage || query.isFetchingNextPage}
              >
                {query.isFetchingNextPage
                  ? "Loading more..."
                  : query.hasNextPage
                  ? "Load More"
                  : "Nothing more to load"}
              </button>
            </div>
            <div>{query.isFetching && !query.isFetchingNextPage ? "looking for changes..." : null}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
