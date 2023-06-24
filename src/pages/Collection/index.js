import { Box, Card, Divider, Group, Tabs, Text } from "@mantine/core";
import { IconCloudDownload, IconFolder } from "@tabler/icons";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import ConfirmDelete from "../../components/ConfirmDelete";
import EditableText from "../../components/EditableText";
import { deleteCollection, renameCollection } from "../../store/reducers/root";
import AddChannel from "./AddChannel";
import ChannelsList from "./ChannelsList";
import JobsTable from "./JobsTable";
import { deleteChannelIDB } from "./helpers/deleteChannelIDB";
import { deleteCollectionIDB } from "./helpers/deleteCollectionIDB";
import { getChannelsIDB } from "./helpers/getChannelsIDB";

export default function Collection() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [channels, setChannels] = useState([]);

  const jobs = useSelector((state) => state.jobs);
  const collection = useSelector(
    (state) => state.collections[id],
    shallowEqual
  );

  useEffect(() => {
    if (collection) {
      getChannelsIDB(collection.id, setChannels);
    }
  }, [collection]);

  if (!collection) {
    return <Navigate to={"/"} />;
  }

  const onEdit = (e) => {
    const text = e.target.value;
    if (text) dispatch(renameCollection({ id, text }));
  };

  const onDeleteCollection = () => {
    const jobsToDelete = Object.keys(jobs).filter((item) =>
      item.includes(collection.id)
    );

    dispatch(deleteCollection({ id: collection.id, jobs: jobsToDelete }));
    deleteCollectionIDB(collection.id, jobsToDelete);
  };

  const onDeleteChannel = async (channelId) => {
    await deleteChannelIDB(collection.id, channelId);
    refreshChannels();
  };

  const refreshChannels = () => getChannelsIDB(collection.id, setChannels);

  return (
    <>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          mb={15}
        >
          <EditableText
            text={collection.title}
            onChange={onEdit}
            withIcon
            size="lg"
            textProps={{ component: "h1" }}
          />
          <Group>
            <Text size="sm" ml={38}>
              {channels?.length} channels
            </Text>

            <ConfirmDelete
              confirmationText="Are you sure you want to delete the collection and contents of it?"
              iconSize={16}
              variant="filled"
              onConfirm={onDeleteCollection}
            />
          </Group>
        </Box>
        <Divider mb={25} />
      </Box>

      <Box mb={"md"}>
        <AddChannel collectionId={collection.id} onInserted={refreshChannels} />
      </Box>

      <Tabs defaultValue="collections">
        <Tabs.List>
          <Tabs.Tab value="collections" icon={<IconFolder size="0.8rem" />}>
            Channels
          </Tabs.Tab>
          <Tabs.Tab value="jobs" icon={<IconCloudDownload size="0.8rem" />}>
            Collected messages
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="collections">
          <Card mb={"md"}>
            <ChannelsList
              collection={collection}
              channels={channels}
              deleteChannel={onDeleteChannel}
            />
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="jobs">
          <Card sx={{ overflow: "visible" }}>
            <JobsTable collection={collection} />
          </Card>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
