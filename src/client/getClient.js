import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

export async function getClient(user) {
  // Get api id and hash from user object
  const id = Number(user.api.split(",")[0]);
  const hash = String(user.api.split(",")[1]);

  // Initiate string session
  const session = new StringSession(user.session);

  // If params exist, initiate client
  if (id && hash && session) {
    const client = new TelegramClient(session, id, hash, {
      connectionRetries: 3,
    });

    // Connect and return client
    try {
      await client.connect();
      return client;
    } catch (err) {
      console.error("Client connection error.", err);
    }
  } else {
    console.error(
      "Client connection error. id, hash and session must be provided."
    );
  }

  return null;
}
