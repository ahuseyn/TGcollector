import { Box, ScrollArea, Table, Text } from "@mantine/core";
import { deleteIDB } from "helpers/deleteIDB";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { deleteJob, onResumeJob } from "store/reducers/root";
import JobItem from "./JobItem";

export default function JobsTable({ collection }) {
  const jobs = useSelector((state) => state.jobs, shallowEqual);
  const dispatch = useDispatch();

  const jobArr =
    Object.values(jobs).filter(
      (item) =>
        item.id.substr(0, item.id.indexOf(item.started) - 1) ===
        String(collection.id)
    ) || [];

  if (jobArr?.length === 0) {
    return (
      <Text size="sm" c="dimmed" mt={"lg"}>
        No message collected yet. First switch to channels tab. Then select
        channels you want to scrape then click "Collect messages".
      </Text>
    );
  }

  const removeJob = (id) => {
    dispatch(deleteJob(id));
    deleteIDB(id);
  };

  const onResume = (data) => {
    dispatch(
      onResumeJob({
        id: data.id,
        name: data.name,
        params: data.params,
        current: data.current,
      })
    );
  };

  return (
    <>
      <Box display={"flex"} mb={15}></Box>
      <ScrollArea sx={{ overflow: "visible" }}>
        <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
          <thead>
            <tr>
              <th>Job name</th>
              <th>Start date</th>
              <th>Status</th>
              <th>Channels</th>
              <th>Messages</th>
              <th>Download file</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {jobArr.reverse().map((item) => (
              <tr key={item.id}>
                <JobItem
                  data={item}
                  onRemove={() => removeJob(item.id)}
                  onResume={onResume}
                />
              </tr>
            ))}
          </tbody>
        </Table>
      </ScrollArea>
    </>
  );
}
