import {
  ActionIcon,
  Button,
  Card,
  Flex,
  Group,
  Loader,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons";
import { ClientContext } from "components/ClientProvider";
import { getActiveJob } from "helpers/getActiveJob";
import { useContext } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { stopJob } from "store/reducers/root";

export default function ActiveJob() {
  const dispatch = useDispatch();
  const client = useContext(ClientContext);
  const jobs = useSelector((state) => state.jobs, shallowEqual);
  const data = getActiveJob(jobs);

  if (!data) {
    return null;
  }

  const channelCount = data?.params?.channels?.length;
  const currentChannel = data?.current?.channelIndex + 1 || 1;
  const currentChannelId = data?.current?.chanelHandle;
  const totalCurrentMsg = data?.current?.messageCount;
  const totalCollectedMsg = data?.current?.collectedCount;

  const isPaused = data.status === "paused";

  const onStop = (status) => () => {
    dispatch(stopJob({ id: data.id, status }));
  };

  const onResume = () => {
    dispatch({
      type: "root/resumeJob",
      payload: {
        id: data.id,
        name: data.name,
        params: data.params,
        current: data.current,
      },
      meta: {
        client: client.current,
      },
    });
  };

  return (
    <>
      <Card shadow="xs" p={10} withBorder component={Flex}>
        {isPaused ? (
          <ThemeIcon
            size={"xs"}
            mt={3}
            mr={"sm"}
            variant="light"
            color="indigo"
          >
            <IconPlayerPause strokeWidth={1.5} />
          </ThemeIcon>
        ) : (
          <Loader size={"xs"} mr={"sm"} mt={3} />
        )}
        <div>
          <Text fz="sm" fw="bold">
            {`${data.name}`}
          </Text>
          <Text fz="sm" color="dimmed">
            {`Collecting ${currentChannel} out of ${channelCount} channels`}
          </Text>

          <Text fz="sm" color="dimmed">
            {"Current channel: "}
            <strong>{currentChannelId}</strong>
          </Text>

          <Text
            fz={"sm"}
            color="dimmed"
          >{`Collected ${totalCollectedMsg} out of ${totalCurrentMsg} message`}</Text>

          <Group spacing="xs" mt={"xs"}>
            <Button size="xs" color="red" onClick={onStop("canceled")}>
              Cancel
            </Button>

            <Tooltip
              label={
                isPaused
                  ? "Resume the task"
                  : "Pause the task to continue later"
              }
              withArrow
            >
              <ActionIcon
                variant="filled"
                size="md"
                color="indigo"
                onClick={isPaused ? onResume : onStop("paused")}
              >
                {isPaused ? (
                  <IconPlayerPlay size={20} strokeWidth={1.5} />
                ) : (
                  <IconPlayerPause size={20} strokeWidth={1.5} />
                )}
              </ActionIcon>
            </Tooltip>
          </Group>
        </div>
      </Card>
    </>
  );
}
