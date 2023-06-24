import { openDB } from "idb";

export const deleteChannelIDB = (colId, channelId) =>
  openDB(colId)
    .then((db) => db.delete("channels", channelId))
    .catch((err) => console.error("Delete channel err:", err));
