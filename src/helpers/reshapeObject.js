import dayjs from "dayjs";

const peerToValue = {
  PeerUser: "userId",
  PeerChat: "chatId",
  PeerChannel: "channelId",
};

const getForwardLink = (fwdFrom, chats) => {
  if (fwdFrom?.originalArgs?.fromId) {
    const args = fwdFrom?.originalArgs;
    const chat = chats.find(
      (item) =>
        Number(item.id.value) ===
        Number(args.fromId[peerToValue[args.fromId.className]])
    );

    return chat?.username
      ? {
          fwd_channel: chat?.username,
          fwd_message: `https://t.me/${chat.username}/${args.channelPost}`,
        }
      : "";
  }

  return "";
};

const getReactions = (_reactions) => {
  if (_reactions) {
    const results = _reactions.results || [];
    let reactions = {};

    for (let r in results) {
      const _emoticon = `_${results[r].reaction.emoticon}`;
      reactions[_emoticon] = results[r].count;
    }

    return reactions;
  }
  return "";
};

export const reshapeObject = (item, fields, chats, currentChannel) => {
  let object = {};

  try {
    for (let i in fields) {
      switch (fields[i]) {
        case "date": {
          object.date = dayjs.unix(item.date).toISOString();
          break;
        }
        case "editDate": {
          object.editDate = item.editDate
            ? dayjs.unix(item.editDate).toISOString()
            : "";
          break;
        }
        case "replies": {
          object.replies = item.replies?.replies || 0;
          break;
        }
        case "messageLink": {
          object.messageLink = `https://t.me/${currentChannel}/${item.id}`;
          break;
        }
        // case "replyTo": {
        //   const msg = item.replyTo?.replyToMsgId;

        //   object.replyTo = msg ? `https://t.me/${currentChannel}/${msg}` : "";
        //   break;
        // }
        case "fwdFrom": {
          object.fwdFrom = getForwardLink(item.fwdFrom, chats);
          break;
        }
        case "reactions": {
          object.reactions = getReactions(item.reactions);
          break;
        }
        case "entities": {
          object.entities =
            item.entities?.length > 0
              ? item.entities
                  .filter(
                    (entity) => entity.className === "MessageEntityTextUrl"
                  )
                  .map((entity) => entity.url)
              : [];
          break;
        }
        default: {
          object[fields[i]] = item[fields[i]] || "";
        }
      }
    }
  } catch (err) {
    console.error("Object reshape error:", err);
  }

  return object;
};
