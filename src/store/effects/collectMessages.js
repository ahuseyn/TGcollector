import { getClient } from "client/getClient";
import { getHistory } from "helpers/getHistory";
import { reshapeMessages } from "helpers/reshapeMessages";
import { openDB } from "idb";
import toast from "react-hot-toast";
import { stopJob, updateJob } from "store/reducers/root";

export async function collectMessages(
  action,
  { dispatch, getState, fork, condition }
) {
  // Extract required params
  const { params, id: jobTitle, current = {} } = action.payload;
  const { channels, fields, limit } = params;

  const interval = Number(params.interval * 1000);

  // Get state and initiate client
  const state = getState();
  const client = await getClient(state.user);

  let totalMsgCount = current.totalMsgCount || 0;

  // Create cancellable child task to collect messages
  const { cancel: cancelCollector } = fork(async ({ delay, signal }) => {
    for (let i = current.channelIndex || 0; i < channels.length; i++) {
      const channel = channels[i];

      let offset = current.offset || 0; // Offset for current channel
      let chComplete = current.chComplete || false; // Is current channel fully collected

      while (!chComplete) {
        try {
          // Get history from TG
          const res = await getHistory(client, channel, limit, offset);
          const currMsgCount = res.messages.length;

          // If task cancelled exit
          if (signal.aborted) return;

          if (res?.messages) {
            // Reshape message object
            const messages = res.messages.map(
              reshapeMessages(fields, res.chats, channel)
            );

            // Insert collected messages to IDB
            const db = await openDB(jobTitle, 1, {
              upgrade(db) {
                db.createObjectStore("messages", {
                  keyPath: "chunk",
                  autoIncrement: true,
                });
              },
            });

            await db.add("messages", messages);

            // Update offset
            offset = offset + limit <= res.count ? offset + limit : res.count;

            // If message count less than limit, stop the loop
            if (currMsgCount === 0) chComplete = true;

            // Increase total message count
            totalMsgCount += currMsgCount;

            // Update job status
            dispatch(
              updateJob({
                id: jobTitle,
                data: {
                  current: {
                    offset,
                    channelIndex: i,
                    chanelHandle: channel,
                    messageCount: res.count,
                    collectedCount: offset,
                    totalMsgCount,
                    chComplete,
                  },
                  complete: false,
                  status: "progress",
                  updated: new Date().toISOString(),
                },
              })
            );
          } else {
            throw new Error("Could not fetch messages");
          }
        } catch (err) {
          console.error("Error on message collection: ", err);
          // TODO ask for action, clear garbage if ignored, skip interval if continued
          // TODO send crash report

          // Stop job with error status
          dispatch(
            stopJob({
              id: jobTitle,
              status: "error",
              // TODO add error message
            })
          );

          // Inform user with error message
          toast.error("Error on message collection: " + err, {
            id: "info-collect",
          });
        }

        await delay(interval); // Delay subsequent execution by user defined interval
      }
    }

    // Complete job
    dispatch(
      updateJob({
        id: jobTitle,
        data: {
          current: {},
          messageCount: totalMsgCount,
          complete: true,
          status: "success",
        },
      })
    );

    // Inform user with success message
    toast.success("Messages collected", {
      id: "info-collect",
    });
  });

  // Cancel collector child task, if stopJob called by user
  await condition(stopJob.match);
  cancelCollector();
}
