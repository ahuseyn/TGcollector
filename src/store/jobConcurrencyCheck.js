import { getActiveJob } from "helpers/getActiveJob";
import toast from "react-hot-toast";

const actionsToCheck = ["root/insertJob", "root/resumeJob"];

export const jobConcurrencyCheck =
  ({ getState }) =>
  (next) =>
  (action) => {
    if (actionsToCheck.includes(action.type)) {
      const state = getState();
      const activeJob = getActiveJob(state.jobs);
      const resumeAttempt = activeJob?.id === action.payload.id;

      if (activeJob && !resumeAttempt) {
        return toast.error(
          "Only one concurrent job is possible at the time. You can cancel the other job to start a new one.",
          {
            id: "error-concurrency",
          }
        );
      }
    }

    return next(action);
  };
