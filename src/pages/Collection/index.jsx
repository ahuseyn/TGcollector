import { Box, Card, Divider, Group, Tabs, Text } from "@mantine/core";
import { IconCloudDownload, IconFolder } from "@tabler/icons";
import AddChannel from "components/AddChannel";
import ChannelsList from "components/ChannelsList";
import { ClientContext } from "components/ClientProvider";
import ConfirmDelete from "components/ConfirmDelete";
import EditableText from "components/EditableText";
import JobsTable from "components/JobsTable";
import { deleteChannelIDB } from "helpers/deleteChannelIDB";
import { deleteCollectionIDB } from "helpers/deleteCollectionIDB";
import { getChannelsIDB } from "helpers/getChannelsIDB";
import { getChannelsTG } from "helpers/getChannelsTG";
import { insertChannelsIDB } from "helpers/insertChannelsIDB";
import { reshapeChannels } from "helpers/reshapeChannels";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import {
  deleteCollection,
  renameCollection,
  setAskLogin,
} from "store/reducers/root";

export default function Collection() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [channels, setChannels] = useState([]);

  const user = useSelector((state) => state.user);

  const client = useContext(ClientContext);

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
    return <Navigate to={"/"} />; // Go to dashboard if no collection exist
  }

  // Update collection title
  const onEdit = (e) => {
    const text = e.target.value;
    if (text) dispatch(renameCollection({ id, text }));
  };

  // Delete the collection
  const onDeleteCollection = () => {
    const jobsToDelete = Object.keys(jobs).filter((item) =>
      item.includes(collection.id)
    );

    dispatch(deleteCollection({ id: collection.id, jobs: jobsToDelete }));
    deleteCollectionIDB(collection.id, jobsToDelete);
  };

  // Delete channel from the collection
  const onDeleteChannel = async (channelId) => {
    await deleteChannelIDB(collection.id, channelId);
    refreshChannels();
  };

  // Insert new channels to the collection
  const onInsert = async (channelInput) => {
    if (!Boolean(channelInput.trim())) return;

    if (!user.logged) {
      return dispatch(setAskLogin(true));
    }

    toast.loading("Inserting channels", { id: "add-channel" });

    try {
      const readyChannels = channelInput.replace(/\s/g, "").split(",");
      const values = await getChannelsTG(client, readyChannels);
      const channels = values.filter((item) => item.data).map(reshapeChannels);
      await insertChannelsIDB(collection.id, channels);

      refreshChannels();

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
  };

  const refreshChannels = () => getChannelsIDB(collection.id, setChannels);

  return (
    <React.Fragment key={id}>
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
        <AddChannel onInsert={onInsert} />
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
    </React.Fragment>
  );
}
