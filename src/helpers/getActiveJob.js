export const getActiveJob = (jobs, includePaused = true) =>
  Object.values(jobs).find(
    (j) => j.status === "progress" || (includePaused && j.status === "paused")
  );
