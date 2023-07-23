export default function getAction(action = {}) {
  switch (action.className) {
    case "MessageActionChannelCreate":
      return `Channel created with the name: ${action.title}`;
    case "MessageActionChatEditTitle":
      return `Channel name changed to: ${action.title}`;
    default: {
      return "";
    }
  }
}
