import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Flex,
  Group,
  Popover,
  Select,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconDownload, IconExclamationCircle, IconList } from "@tabler/icons";
import ConfirmDelete from "components/ConfirmDelete";
import dayjs from "dayjs";
import { downloadFile } from "helpers/downloadFile";
import { useState } from "react";
import { toast } from "react-hot-toast";

const statusColors = {
  canceled: "pink",
  error: "red",
  success: "green",
};

export default function JobItem({
  data,
  onRemove = () => {},
  onResume = () => {},
}) {
  const [format, setFormat] = useState("");

  const onDownload = () => {
    toast.loading("Preparing file", { id: "download-file" });
    downloadFile(data.id, data.name, format);
  };

  return (
    <>
      <Text component="td" fz="xs" c="dimmed">
        {data.name}
      </Text>

      <Text component="td" fz="xs" c="dimmed">
        {dayjs(data.started).format("YYYY-MM-DD")}
      </Text>

      <td>
        <Flex align="center">
          <Badge size="sm" color={statusColors[data.status] || "indigo"} mr={5}>
            {data.status}
          </Badge>

          {data.status === "error" && (
            <Button
              variant="subtle"
              size="xs"
              mr={5}
              onClick={() => onResume(data)}
            >
              Try again
            </Button>
          )}

          {data.error ? (
            <Popover position="bottom-end" withArrow shadow="md">
              <Popover.Target>
                <ActionIcon variant="transparent" size="xs">
                  <IconExclamationCircle />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown>
                <Text size="sm" maw={280}>
                  {data.error}
                </Text>
              </Popover.Dropdown>
            </Popover>
          ) : null}
        </Flex>
      </td>

      <td>
        <Flex align="center">
          <Text fz="xs" c="dimmed" mr="xs">
            {data.params?.channels?.length}
          </Text>
          <Popover position="bottom-end" withArrow shadow="md">
            <Popover.Target>
              <ActionIcon variant="transparent" size="xs">
                <IconList />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
              <Text size="sm" maw={280}>
                {data.params?.channels?.join(", ")}
              </Text>
            </Popover.Dropdown>
          </Popover>
        </Flex>
      </td>

      <Text component="td" fz="xs" c="dimmed">
        {data.messageCount}
      </Text>

      <Box component="td" w={220}>
        {data.status !== "progress" ? (
          <Group spacing={"xs"}>
            <Select
              w={120}
              placeholder="Format"
              dropdownPosition="bottom"
              data={[
                { value: "json", label: "JSON" },
                { value: "csv", label: "CSV" },
                // { value: "xlsx", label: "Excel" },
              ]}
              value={format}
              onChange={setFormat}
            />
            <Tooltip
              label="Attention! This dataset is not fully scraped. It may contain partial data."
              hidden={data.status === "success"}
              multiline
            >
              <ActionIcon
                variant="filled"
                color={data.status === "success" ? "green" : "orange"}
                onClick={onDownload}
              >
                <IconDownload size="1rem" stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Group>
        ) : (
          <Text fz="xs" c="dimmed">
            Not available
          </Text>
        )}
      </Box>

      <Box component="td" w={28}>
        <ConfirmDelete
          confirmationText="Are you sure you want to delete the job and contents of it?"
          iconSize={16}
          variant="filled"
          onConfirm={onRemove}
        />
      </Box>
    </>
  );
}
