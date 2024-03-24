import { Button, Card, Flex, Loader, Text } from "@mantine/core";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { stopJob } from "store/reducers/root";

export default function ActiveJob() {
  const dispatch = useDispatch();
  const jobs = useSelector((state) => state.jobs, shallowEqual);
  const data = Object.values(jobs).find((j) => j.status === "progress");

  if (!data) {
    return null;
  }

  const channelCount = data?.params?.channels?.length;
  const currentChannel = data?.current?.channelIndex + 1 || 1;
  const currentChannelId = data?.current?.chanelHandle;
  const totalCurrentMsg = data?.current?.messageCount;
  const totalCollectedMsg = data?.current?.collectedCount;

  const onStop = (status) => () => {
    dispatch(stopJob({ id: data.id, status }));
  };

  return (
    <>
      <Card shadow="xs" p={10} withBorder component={Flex}>
        <Loader size={"xs"} mr={"sm"} mt={3} />
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

          <Button size="xs" color="red" mt={"xs"} onClick={onStop("canceled")}>
            Cancel
          </Button>
        </div>
      </Card>
    </>
  );
}
