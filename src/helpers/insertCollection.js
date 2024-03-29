import { insertChannelsIDB } from "helpers/insertCollectionIDB";
import { nanoid } from "nanoid";
import { insertCollection as _insertCollection } from "store/reducers/root";

const insertCollection = (order, dispatch, navigate) => {
  const id = nanoid(8);
  const title = `Collection ${order}`;

  dispatch(
    _insertCollection({
      [id]: { id, title, channels: {} },
    })
  );

  insertChannelsIDB(id);

  navigate(`/collection/${id}`);
};

export default insertCollection;
