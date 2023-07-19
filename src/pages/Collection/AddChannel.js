import { ActionIcon, TextInput } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { IconArrowRight, IconBrandTelegram } from "@tabler/icons";
import { useContext } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { ClientContext } from "../../components/ClientProvider";
import { setAskLogin } from "../../store/reducers/root";
import { getChannelsTG } from "./helpers/getChannelsTG";
import { insertChannelsIDB } from "./helpers/insertChannelsIDB";
import { reshapeChannels } from "./helpers/reshapeChannels";

export default function AddChannel({ collectionId, onInserted = () => {} }) {
  const [channel, setChannel] = useInputState("");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const client = useContext(ClientContext);

  const onInsert = async (e) => {
    e.preventDefault();
    if (!Boolean(channel.trim())) return;

    if (!user.logged) {
      return dispatch(setAskLogin(true));
    }

    toast.loading("Inserting channels", { id: "add-channel" });

    try {
      const readyChannels = channel.replace(/\s/g, "").split(",");
      const values = await getChannelsTG(client, readyChannels);
      const channels = values.filter((item) => item.data).map(reshapeChannels);
      await insertChannelsIDB(collectionId, channels);

      onInserted();

      const failCount = values.filter((item) => !item.data).length;
      const total = values?.length;

      if (total - failCount > 0) {
        toast.success(`${total - failCount} channel added successfully`, {
          id: "add-channel",
        });
      }
    } catch (err) {
      console.error("Promise failed:", err);
    }

    setChannel("");
  };

  return (
    <form onSubmit={onInsert}>
      <TextInput
        icon={<IconBrandTelegram size="1.1rem" stroke={1.5} />}
        radius="xl"
        size="md"
        value={channel}
        onChange={setChannel}
        rightSection={
          <ActionIcon
            size={32}
            radius="xl"
            color="indigo"
            variant="filled"
            type="submit"
          >
            <IconArrowRight size="1.1rem" stroke={1.5} />
          </ActionIcon>
        }
        placeholder="Insert channel handles here, separated with comma"
        rightSectionWidth={42}
      />
    </form>
  );
}
