import { Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { nanoid } from "nanoid";
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { collectorDefaults } from "../../constants/collectorDefaults";
import JobContext from "../../context/JobContext";
import { insertJob } from "../../store/reducers/root";
import { TableSelection } from "./ChannelTable";
import CollectDialog from "./CollectDialog";
import { toast } from "react-hot-toast";

export default function ChannelsList({ collection, channels, deleteChannel }) {
  const dispatch = useDispatch();
  const [modal, { open, close }] = useDisclosure(false);
  const [state, setState] = useState(collectorDefaults);

  const { collect } = useContext(JobContext);

  const onSelect = (selection) => {
    setState({ ...state, channels: selection });
    open();
  };

  const onCollect = () => {
    const execTime = new Date().toISOString();
    const jobTitle = `${collection.id}_${execTime}_${nanoid(4)}`;

    dispatch(
      insertJob({
        [jobTitle]: {
          name: state.name,
          id: jobTitle,
          started: execTime,
          params: state,
        },
      })
    );

    close();
    setState(collectorDefaults);
    collect(state, 0, jobTitle);

    toast.success("Message collection started", { id: "info-collect" });
  };

  return (
    <>
      {channels.length === 0 ? (
        <>
          <Text size="sm" c="dimmed" mt={"lg"}>
            No channel added yet. Login to your Telegram account and add some
            new channels above.
          </Text>
        </>
      ) : (
        <>
          {
            <TableSelection
              data={channels}
              onSelect={onSelect}
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
