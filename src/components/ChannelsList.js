import { Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { TableSelection } from "components/ChannelTable";
import CollectDialog from "components/CollectDialog";
import { collectorDefaults } from "constants/collectorDefaults";
import { exportCollection } from "helpers/exportCollection";
import { nanoid } from "nanoid";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { insertJob } from "store/reducers/root";

export default function ChannelsList({
  isFolder,
  collection,
  channels,
  deleteChannel,
}) {
  const dispatch = useDispatch();
  const [modal, { open, close }] = useDisclosure(false);
  const [state, setState] = useState(collectorDefaults);

  const onSelect = (selection) => {
    setState({ ...state, channels: selection });
    open();
  };

  const onExport = (selection) => {
    const name = `${collection.title}_${collection.id}`;
    const selected = channels.filter((item) =>
      selection.includes(item.username)
    );

    exportCollection(selected, name, isFolder);
  };

  const onCollect = () => {
    const execTime = new Date().toISOString();
    const jobTitle = `${collection.id}_${execTime}_${nanoid(4)}`;

    dispatch(
      insertJob({
        name: state.name,
        id: jobTitle,
        started: execTime,
        params: state,
      })
    );

    close();
    setState(collectorDefaults);

    toast.success("Message collection started", { id: "info-collect" });
  };

  return (
    <>
      {channels.length === 0 ? (
        <>
          <Text size="sm" c="dimmed" mt={"lg"}>
            {isFolder
              ? "No channel added yet. Go to your Telegram app or Telegram Web and add some channels."
              : "No channel added yet. Login to your Telegram account and add some new channels above."}
          </Text>
        </>
      ) : (
        <>
          {
            <TableSelection
              isFolder={isFolder}
              data={channels}
              onSelect={onSelect}
              onExport={onExport}
              onRemove={deleteChannel}
            />
          }
        </>
      )}
      <CollectDialog
        open={modal}
        onClose={close}
        state={state}
        setState={setState}
        onCollect={onCollect}
      />
    </>
  );
}
