import { ActionIcon, Alert, Button, Card, Text } from "@mantine/core";
import { IconAlertCircle, IconTrash } from "@tabler/icons";
import { toast } from "react-hot-toast";

export default function ConfirmDelete({
  onConfirm = () => {},
  id = "confirm-delete",
  confirmationText = "Are you sure you want to delete the item?",
  iconSize = 16,
  ...rest
}) {
  const confirm = () => {
    toast.remove(id);
    onConfirm();
  };

  const onDelete = () => {
    toast.custom(
      <Alert
        component={Card}
        shadow={"sm"}
        icon={<IconAlertCircle size="1rem" />}
        color="red"
        miw={480}
        maw={640}
      >
        <Text>{confirmationText}</Text>
        <Button onClick={() => toast.remove(id)} mt={"sm"} mr={"xs"} size="xs">
          Cancel
        </Button>
        <Button
          variant="light"
          mt={"sm"}
          size="xs"
          color="red"
          onClick={confirm}
        >
          Delete
        </Button>
      </Alert>,
      { id }
    );
  };

  return (
    <ActionIcon color="red" onClick={onDelete} {...rest}>
      <IconTrash size={iconSize} />
    </ActionIcon>
  );
}
