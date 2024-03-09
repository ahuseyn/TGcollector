import { ClientContext } from "components/ClientProvider";
import { IDB_MSG_THRESHOLD } from "constants/parameters";
import JobContext from "context/JobContext";
import getAction from "helpers/getAction";
import { reshapeObject } from "helpers/reshapeObject";
import { openDB } from "idb";
import { useContext } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useStore } from "react-redux";
import { updateJob } from "store/reducers/root";
import { Api } from "telegram";

export default function Collector({ children }) {
  const dispatch = useDispatch();
  const client = useContext(ClientContext);
  const store = useStore();

  async function collect(
    params,
    offset = 0,
    jobTitle,
    channelIndex = 0,
    prevMessages = []
  ) {
    const { channels, fields, limit, interval } = params;
    const currentChannel = channels[channelIndex];

    const jobState = store.getState()?.jobs[jobTitle]?.status;
    if (jobState === "canceled") {
      return;
    }

    try {
      // Get history from TG
      const response = await client.invoke(
        new Api.messages.GetHistory({
          peer: currentChannel,
          limit: Number(limit),
          addOffset: Number(offset),
        })
      );

      // Convert result into JSON
      const data = await response.toJSON();

      // Reshape message structure with user defined schema
      const newMessages = data.messages.map((item) => {
        const object = reshapeObject(
          item,
          fields,
          response.chats,
          currentChannel
        );

        return {
          ...object,
          channel: currentChannel,
          className: item.className,
          action: getAction(item.action),
        };
      });

      // Push new messages into old array
      prevMessages.push(...newMessages);

      if (prevMessages.length >= IDB_MSG_THRESHOLD) {
        // Once threshold reached save messages to IDB

        const db = await openDB(jobTitle, 1, {
          upgrade(db) {
            db.createObjectStore("messages", {
              keyPath: "chunk",
              autoIncrement: true,
            });
          },
        });

        await db.add("messages", prevMessages);

        prevMessages = [];
      }

      // Update the job status
      dispatch(
        updateJob({
          id: jobTitle,
          data: {
            current: {
              offset,
              channelIndex,
              chanelHandle: channels[channelIndex],
              messageCount: data.count,
              collectedCount:
                offset + limit <= data.count ? offset + limit : data.count,
            },
            complete: false,
            status: "progress",
            updated: new Date().toISOString(),
          },
        })
      );

      if (data.messages.length == limit) {
        // If we have more pages run collect

        setTimeout(() => {
          // Interval defined by user

          collect(params, offset + limit, jobTitle, channelIndex, prevMessages);
        }, Number(interval * 1000));
      } else {
        // If no more page to collect

        if (prevMessages.length > 0) {
          // If we have unsaved messages save them to the IDB

          const db = await openDB(jobTitle, 1, {
            upgrade(db) {
              db.createObjectStore("messages", {
                keyPath: "chunk",
                autoIncrement: true,
              });
            },
          });

          await db.add("messages", prevMessages);
        }

        if (channelIndex < channels.length - 1) {
          // If we have more channels move to the next channel

          setTimeout(() => {
            collect(params, 0, jobTitle, channelIndex + 1);
          }, Number(interval * 1000));
        } else {
          // If all channels complete update the progress and exit

          const db = await openDB(jobTitle);
          const msgs = await db.getAll("messages");

          const msgsCount = msgs.flat().length;

          dispatch(
            updateJob({
              id: jobTitle,
              data: {
                current: {
                  offset,
                  channelIndex,
                  chanelHandle: channels[channelIndex],
                  messageCount: data.count,
                  collectedCount:
                    offset + limit <= data.count ? offset + limit : data.count,
                },
                messageCount: msgsCount,
                complete: true,
                status: "success",
              },
            })
          );

          toast.success("Messages collected successfully", {
            id: "info-collect",
          });
        }
      }
    } catch (error) {
      console.error("Error happened while collecting data:", error);

      dispatch(
        updateJob({
          id: jobTitle,
          data: {
            status: "error",
            error: String(error),
          },
        })
      );

      toast.error("Error on message collection: " + error, {
        id: "info-collect",
      });
    }
  }

  return (
    <JobContext.Provider value={{ collect }}>{children}</JobContext.Provider>
  );
}
