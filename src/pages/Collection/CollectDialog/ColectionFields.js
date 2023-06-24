import { MultiSelect, Text } from "@mantine/core";
import { forwardRef } from "react";
import { messageFields } from "../../../constants/messageFields";

export default function CollectionFields({ data, onChange, ...rest }) {
  return (
    <MultiSelect
      data={messageFields}
      itemComponent={SelectItem}
      label="Add/remove message fields to save"
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
