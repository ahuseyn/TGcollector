import { Anchor, Box, Card, Group, Tabs, Text } from "@mantine/core";
import { IconCloudDownload, IconFolder } from "@tabler/icons";
import ChannelsList from "components/ChannelsList";
import JobsTable from "components/JobsTable";
import { shallowEqual, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";

export function Folder() {
  const { id } = useParams();
  const folder = useSelector((state) => state.folders[id], shallowEqual);

  if (!folder) {
    return <Navigate to={"/"} />;
  }

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
          <Box maw={"80%"}>
            <Text size="lg" component="h1">
              {folder.title}
            </Text>
            <Text color="dimmed">
              Folders are read only in TG collector. But you can edit them from
              your app or from{" "}
              <Anchor href="https://web.telegram.org/" target="_blank">
                Telegram Web
              </Anchor>
              . This list contains only channels in the folder with usernames.
            </Text>
          </Box>
          <Group>
            <Text size="sm" ml={38}>
              {folder.channels?.length} channels
            </Text>
          </Group>
        </Box>
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
              isFolder
              collection={folder}
              channels={folder.channels}
            />
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="jobs">
          <Card sx={{ overflow: "visible" }}>
            <JobsTable collection={folder} />
          </Card>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
