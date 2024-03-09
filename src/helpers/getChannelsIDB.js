import { openDB } from "idb";

export const getChannelsIDB = (colId, setChannels) => {
  openDB(colId)
    .then((db) => db.getAll("channels"))
    .then((res) => setChannels(res))
    .catch((err) => console.error("Get channel err:", err));
};
