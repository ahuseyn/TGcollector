import { ActionIcon, Box, Group, Spoiler, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons";
import dayjs from "dayjs";

export default function ChannelItem({
  channel,
  onRemove = () => {},
  isFolder = false,
}) {
  return (
    <>
      <td>
        <Group spacing="sm" noWrap miw={100}>
          {/* <Avatar size={40} src={photo.data} radius={40}>
            {!photo.data ? title.slice(0, 2) : undefined}
          </Avatar> */}
          <div>
            <Text fz="sm" fw={500}>
              {channel.title}
            </Text>
            <Text
              c="dimmed"
              fz="xs"
              component="a"
              target="_blank"
              href={`https://t.me/${channel.username}`}
            >
              {`@${channel.username}`}
            </Text>
          </div>
        </Group>
      </td>

      <td>
        <Text fz="xs" c="dimmed">
          {channel.about}
        </Text>

        {channel.lastMessage && (
          <Spoiler
            fz="xs"
            c="dimmed"
            maxHeight={38}
            showLabel="Show more"
            hideLabel="Hide"
          >
            {channel.lastMessage}
          </Spoiler>
        )}
      </td>

      <Box component="td" w={140}>
        <Text fz="xs" c="dimmed">
          {channel.participantsCount}
        </Text>
      </Box>

      <Box component="td" w={120}>
        <Text fz="xs" c="dimmed">
          {dayjs.unix(channel.creationDate).format("DD-MM-YYYY")}
        </Text>
      </Box>

      {!isFolder && (
        <Box component="td" w={28}>
          <ActionIcon onClick={() => onRemove(channel.id)}>
            <IconTrash size="1rem" stroke={1.5} color="red" />
          </ActionIcon>
        </Box>
      )}
    </>
  );
}
