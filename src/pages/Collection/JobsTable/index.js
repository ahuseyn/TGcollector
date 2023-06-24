import { Box, Table, Text } from "@mantine/core";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import JobItem from "./JobItem";
import { deleteIDB } from "../helpers/deleteIDB";
import { deleteJob } from "../../../store/reducers/root";

export default function JobsTable({ collection }) {
  const jobs = useSelector((state) => state.jobs, shallowEqual);
  const dispatch = useDispatch();

  const jobArr =
    Object.values(jobs).filter((item) => item.id.includes(collection.id)) || [];

  if (jobArr?.length === 0) {
    return (
      <Text size="sm" c="dimmed" mt={"lg"}>
        No message collected yet. First add channel to the collection, then
        collect the messages from those channels.
      </Text>
    );
  }

  const removeJob = (id) => {
    dispatch(deleteJob(id));
    deleteIDB(id);
  };

  return (
    <>
      <Box display={"flex"} mb={15}></Box>
      <Table verticalSpacing="sm">
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
              <JobItem data={item} onRemove={() => removeJob(item.id)} />
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
