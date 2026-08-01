import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

export const ClientContext = React.createContext();

export default function ClientProvider({ children }) {
  const [client, setClient] = useState();
  const user = useSelector((state) => state.user);

  const id = Number(user.api.split(",")[0]);
  const hash = String(user.api.split(",")[1]);

  useEffect(() => {
    const session = new StringSession(user.session);

    if (id && hash && session) {
      const client = new TelegramClient(session, id, hash, {
        connectionRetries: 2,
      });

      client
        .connect()
        .then(() => setClient(client))
        .catch((err) => console.error("Error on client connection:", err));
    }
  }, [id, hash, user.session]);

  return (
    <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
  );
}
