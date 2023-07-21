import {
  Button,
  Divider,
  Flex,
  Group,
  Modal,
  NumberInput,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";
import { toast } from "react-hot-toast";
import { shallowEqual, useSelector } from "react-redux";
import CollectionFields from "./ColectionFields";

export default function CollectDialog({
  open,
  state,
  setState = () => {},
  onClose = () => {},
  onCollect = () => {},
}) {
  const jobs = useSelector((state) => state.jobs, shallowEqual);
  const activeJob = Object.values(jobs).find((j) => j.status === "progress");

  const collectionAttempt = (e) => {
    e.preventDefault();

    if (activeJob) {
      return toast.error(
        "Only one concurrent job is possible at the time. You can cancel the other job to start a new one.",
        {
          id: "error-concurrency",
        }
      );
    }

    onCollect();
  };

  return (
    <>
      <Modal
        size={"md"}
        opened={open}
        onClose={onClose}
        title={`Collect messages (${state.channels.length} channel selected)`}
        centered
      >
        <form onSubmit={collectionAttempt}>
          <TextInput
            withAsterisk={false}
            sx={{ flex: 1 }}
            label="Job name"
            required
            placeholder="Type the job name..."
            value={state.name}
            onChange={(e) =>
              setState((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            mb={"sm"}
          />
          <CollectionFields
            data={state.fields}
            onChange={(e) => setState((prev) => ({ ...prev, fields: e }))}
          />
          <Divider
            required
            labelProps={{ color: "dimmed" }}
            label="Advanced settings"
            mt={"lg"}
          />
          <Flex my={"sm"} align={"flex-end"}>
            <NumberInput
              hideControls
              withAsterisk={false}
              mr={10}
              required
              min={1}
              max={100}
              label={
                <Group position="apart">
                  <Text> {"Message per request"} </Text>
                  <Tooltip
                    width={240}
                    multiline
                    label="Reasonable amount of message per request keep you from being blocked by Telegram (Max 100)"
                    position="top-end"
                    withArrow
                  >
                    <div>
                      <IconAlertCircle
                        size="1rem"
                        style={{ display: "block", opacity: 0.5 }}
                      />
                    </div>
                  </Tooltip>
                </Group>
              }
              value={state.limit}
              onChange={(e) =>
                setState((prev) => ({ ...prev, limit: Number(e) }))
              }
              w={"100%"}
              labelProps={{ w: "100%" }}
            />
            <NumberInput
              labelProps={{ w: "100%" }}
              w={"100%"}
              hideControls
              precision={2}
              withAsterisk={false}
              label={
                <Group position="apart">
                  <Text> {"Wait between requests"} </Text>
                  <Tooltip
                    width={240}
                    multiline
                    label="Enough interval between the queries will keep you being blocked by Telegram"
                    position="top-end"
                    withArrow
                  >
                    <div>
                      <IconAlertCircle
                        size="1rem"
                        style={{ display: "block", opacity: 0.5 }}
                      />
                    </div>
                  </Tooltip>
                </Group>
              }
              value={state.interval}
              required
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  interval: Number(e),
                }))
              }
              rightSection={
                <Text size={12} color="dimmed" w={30}>
                  sec
                </Text>
              }
            />
          </Flex>
          <Button mt={"lg"} fullWidth type="submit">
            Start collecting
          </Button>{" "}
        </form>
      </Modal>
    </>
  );
}
