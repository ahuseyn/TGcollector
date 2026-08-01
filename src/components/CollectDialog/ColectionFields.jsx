import { Button, MultiSelect, Text } from "@mantine/core";
import { messageFields } from "constants/messageFields";
import { forwardRef } from "react";

export default function CollectionFields({ data, onChange, ...rest }) {
  // Select all message fields
  const selectAll = () => {
    const allFields = Object.values(messageFields).map((field) => field.value);
    onChange(allFields);
  };

  return (
    <MultiSelect
      data={messageFields}
      itemComponent={SelectItem}
      labelProps={{
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        },
      }}
      justify="between"
      label={
        <>
          <span>Add/remove message fields to save</span>
          <Button variant="transparent" onClick={selectAll} p={0}>
            Select all
          </Button>
        </>
      }
      placeholder="No fields selected"
      value={data}
      searchable
      onChange={onChange}
      {...rest}
    />
  );
}

const SelectItem = forwardRef(
  ({ image, label, value, description, ...others }, ref) => (
    <div ref={ref} {...others}>
      <Text>{`${label}`}</Text>
      <Text size="xs" color="dimmed">
        {description}
      </Text>
    </div>
  )
);
