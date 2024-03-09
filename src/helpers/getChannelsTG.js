import { toast } from "react-hot-toast";
import { Api } from "telegram";

const QUERY_INTEVAL = 300;

const getFullChannel = (client, channel) =>
  client
    .invoke(
      new Api.channels.GetFullChannel({
        channel: channel,
      })
    )
    .then((e) => e.toJSON());

export const getChannelsTG = (client, channels) => {
  const withInterval = channels.map((item, index) =>
    new Promise((resolve) => {
      setTimeout(resolve, index * QUERY_INTEVAL);
    }).then(() =>
      getFullChannel(client, item)
        .then((res) => {
          toast.loading(
            `Inserting channels - ${index + 1} out of ${channels.length}`,
            {
              id: "add-channel",
            }
          );

          return {
            handle: item,
            data: res,
          };
        })
        .catch((err) =>
          toast.error(
            `Channel could not be added: ${err.errorMessage || err}`,
            { id: `add-channel` }
          )
        )
    )
  );

  return Promise.all(withInterval);
};
