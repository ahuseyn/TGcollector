import { ActionIcon, TextInput } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { IconArrowRight, IconBrandTelegram } from "@tabler/icons";

export default function AddChannel({ onInsert = () => {} }) {
  const [value, setValue] = useInputState("");

  const onSubmit = (e) => {
    e.preventDefault();
    onInsert(value);
    setValue("");
  };

  return (
    <form onSubmit={onSubmit}>
      <TextInput
        icon={<IconBrandTelegram size="1.1rem" stroke={1.5} />}
        radius="xl"
        size="md"
        value={value}
        onChange={setValue}
        rightSection={
          <ActionIcon
            size={32}
            radius="xl"
            color="indigo"
            variant="filled"
            type="submit"
          >
            <IconArrowRight size="1.1rem" stroke={1.5} />
          </ActionIcon>
        }
        placeholder="Insert channel handles here, separated with comma"
        rightSectionWidth={42}
      />
    </form>
  );
}
