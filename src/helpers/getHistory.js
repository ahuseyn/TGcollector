import { Api } from "telegram";

// Get message archive from the peer
export const getHistory = (client, peer, limit, offset) => {
  return client
    .invoke(
      new Api.messages.GetHistory({
        peer: peer,
        limit: Number(limit),
        addOffset: Number(offset),
      })
    )
    .then((res) => res.toJSON());
};
