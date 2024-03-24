import getAction from "./getAction";
import { reshapeFields } from "./reshapeFields";

// Message array iterator with included fields, chats and channels to reshape message object
export const reshapeMessages = (fields, chats, channel) => (item) => {
  const object = reshapeFields(item, fields, chats, channel);

  return {
    ...object,
    channel,
    className: item.className,
    action: getAction(item.action),
  };
};
