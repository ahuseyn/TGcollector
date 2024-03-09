import { openDB } from "idb";

export const insertChannelsIDB = async (colId) =>
  await openDB(colId, 1, {
    upgrade(db) {
      db.createObjectStore("channels", {
        keyPath: "id",
        autoIncrement: true,
      });
    },
  });
