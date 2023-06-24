import { toast } from "react-hot-toast";
import { deleteIDB } from "./deleteIDB";

export const deleteCollectionIDB = async (colId, jobs) => {
  Promise.all([
    ...jobs.map((item) =>
      deleteIDB(item).catch((err) =>
        toast.error(`Job couldn't be deleted: ${err}`)
      )
    ),
    deleteIDB(colId),
  ]);
};
