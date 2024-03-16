export const foldersReducer = (dialogs) => (p, curr) => {
  const { id, title, includePeers } = curr.toJSON();

  let channels = [];

  for (let peer of includePeers) {
    if (peer.className === "InputPeerChannel") {
      const ch = dialogs.find(
        (d) => d.entity.id.value === peer.channelId.value
      );

      // Accept only channels with username
      if (ch && ch.entity.username) {
        channels.push({
          id: Number(ch.entity.id.value),
          username: ch.entity.username,
          lastMessage: ch.message.message,
          title: ch.entity.title,
          creationDate: ch.entity.date,
          participantsCount: ch.entity.participantsCount,
        });
      }
    }
  }

  return {
    ...p,
    [`f${id}`]: {
      id,
      title,
      channels,
    },
  };
};
