import { Box, Button, Checkbox, Table, createStyles } from "@mantine/core";
import { IconDownload } from "@tabler/icons";
import { useState } from "react";
import ChannelItem from "./ChannelItem";

const useStyles = createStyles((theme) => ({
  rowSelected: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0],
  },
}));

export function TableSelection({
  data,
  onSelect = () => {},
  onExport = () => {},
  onRemove = () => {},
}) {
  const { classes, cx } = useStyles();
  const [selection, setSelection] = useState([]);
  const toggleRow = (id) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) =>
      current.length === data.length ? [] : data.map((item) => item.username)
    );

  const rows = data.map((item) => {
    const selected = selection.includes(item.username);

    return (
      <tr key={item.id} className={cx({ [classes.rowSelected]: selected })}>
        <Box component="td" w={28}>
          <Checkbox
            checked={selection.includes(item.username)}
            onChange={() => toggleRow(item.username)}
            transitionDuration={0}
          />
        </Box>
        <ChannelItem channel={item} onRemove={onRemove} />
      </tr>
    );
  });

  return (
    <>
      <Box display={"flex"} mb={15}>
        <Button
          variant="outline"
          ml="auto"
          mr={"sm"}
          disabled={selection.length === 0}
          onClick={() => onExport(selection)}
          leftIcon={<IconDownload size="16" />}
        >
          Export selected
        </Button>
        <Button
          variant="primary"
          disabled={selection.length === 0}
          onClick={() => onSelect(selection)}
        >
          Collect messages
        </Button>
        {/* <Button
          variant="outline"
          ml={5}
          color="red"
          disabled={selection.length === 0}
          onClick={() => onRemove(selection)}
        >
          Delete selected
        </Button> */}
      </Box>
      <Table verticalSpacing="sm">
        <thead>
          <tr>
            <th>
              <Checkbox
                onChange={toggleAll}
                checked={selection.length === data.length}
                indeterminate={
                  selection.length > 0 && selection.length !== data.length
                }
                transitionDuration={0}
              />
            </th>
            <th>Channel</th>

            <th>Description</th>
            <th>Subscribers</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
}
