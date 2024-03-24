export const reshapeChannels = (item) => {
  const data = item.data;

  const id = Number(data.fullChat.id.value);
  const chat = data.chats.find((item) => Number(item.id.value) === id);
  const username = item.handle || chat.username;
  const about = data.fullChat.about || "-";
  const title = chat.title;
  const creationDate = chat.date;
  const participantsCount = data.fullChat.participantsCount;

  return {
    id,
    username,
    about,
    title,
    creationDate,
    participantsCount,
  };
};
