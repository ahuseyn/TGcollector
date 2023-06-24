import { deleteDB } from "idb";

export const deleteIDB = async (colId) => await deleteDB(colId);
