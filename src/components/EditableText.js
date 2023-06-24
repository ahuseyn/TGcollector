import { ActionIcon, Group, Text, TextInput } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { IconCheck, IconEdit } from "@tabler/icons";
import { useState } from "react";

export default function EditableText({
  text,
  withIcon = false,
  size = "sm",
  onChange = () => {},
  textProps = {},
}) {
  const [edit, setEdit] = useState(false);
  const ref = useClickOutside(() => setEdit(false));

  return (
    <Group spacing="xs">
      {withIcon ? (
        <ActionIcon variant="default" onClick={() => setEdit(!edit)}>
          {edit ? (
            <IconCheck size={16} stroke={1.5} />
          ) : (
            <IconEdit size={16} stroke={1.5} />
          )}
        </ActionIcon>
      ) : null}
      {edit ? (
        <form onSubmit={() => setEdit(false)}>
          <TextInput
            ref={ref}
            autoFocus
            value={text}
            onChange={(e) => onChange(e)}
            variant="unstyled"
            size={size}
          />
        </form>
      ) : (
        <Text size={size} onClick={() => setEdit(true)} {...textProps}>
          {text}
        </Text>
      )}
    </Group>
  );
}
