import { ActionIcon, Flex } from "@mantine/core";
import { IconX } from "@tabler/icons";
import { toast } from "react-hot-toast";
import { Api } from "telegram";

const getFullChannel = (client, channel) =>
  client
    .invoke(
      new Api.channels.GetFullChannel({
        channel: channel,
      })
    )
    .then((e) => e.toJSON());

export const getChannelsTG = (client, channels) => {
  return Promise.all(
    channels.map((item) =>
      getFullChannel(client, item)
        .then((res) => ({
          handle: item,
          data: res,
        }))
        .catch((err) =>
          toast.error(
            `Channel could not be added: ${err.errorMessage || err}`,
            { id: `${item}-insert-error` }
          )
        )
    )
  );
};
