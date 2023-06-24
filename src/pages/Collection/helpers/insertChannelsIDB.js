import { openDB } from "idb";

export const insertChannelsIDB = async (colId, channels) => {
  const db = await openDB(colId, 1, {
    upgrade(db) {
      db.createObjectStore("channels", {
        keyPath: "id",
        autoIncrement: true,
      });
    },
  });

  const tx = db.transaction("channels", "readwrite");

  await Promise.all([
    ...channels.map((item) =>
      tx.store
        .put(item)
        .then(() => ({
          handle: item,
          success: true,
        }))
        .catch((err) => ({
          handle: item,
          success: false,
          error: err,
        }))
    ),
    tx.done,
  ]);

  tx.onabort = (event) => {
    console.error("Transaction was aborted", event);
  };
};
