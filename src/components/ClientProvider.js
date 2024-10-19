import { getActiveJob } from "helpers/getActiveJob";
import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "store";
import { apiLogout } from "store/reducers/root";
import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

export const ClientContext = React.createContext();

export default function ClientProvider({ children }) {
  const client = useRef(null);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const jobs = useSelector((state) => state.jobs);

  const id = Number(user.api.split(",")[0]);
  const hash = String(user.api.split(",")[1]);

  const clientEventHandler = useCallback(async (e) => {
    if (e instanceof Api.UpdatesTooLong) {
      const isAuthorized = await e?._client?.isUserAuthorized();

      if (!isAuthorized) store.dispatch(apiLogout());
    }
  }, []);

  useEffect(() => {
    const session = user.session ? new StringSession(user.session) : null;

    if (id && hash && session) {
      client.current = new TelegramClient(session, id, hash, {
        connectionRetries: 2,
      });

      client.current
        .connect()
        .then(() => {
          "provider connected";
          const activeJob = getActiveJob(jobs, false);

          if (activeJob) {
            dispatch({
              type: "root/resumeJob",
              payload: {
                id: activeJob.id,
                name: activeJob.name,
                params: activeJob.params,
                current: activeJob.current,
              },
              meta: {
                client: client.current,
              },
            });
          }

          client.current.addEventHandler(clientEventHandler);
        })
        .catch((err) => {
          const message = err?.message || "";

          if (
            message.includes(
              "Could not find a matching Constructor ID for the TLObject"
            )
          ) {
            // Remove old cache
            localStorage.removeItem("GramJs:apiCache");
          }

          console.error("Error on client connection:", err);
        });

      return () => {
        if (client.current instanceof TelegramClient) {
          client.current.removeEventHandler(clientEventHandler);
          client.current.disconnect();
        }
      };
    }
  }, [id, hash, user.session]);

  return (
    <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
  );
}
