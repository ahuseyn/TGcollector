import toast from "react-hot-toast";

export const concurrencyError = () =>
  toast.error(
    "Only one concurrent job is possible at the time. You can cancel the other job to start a new one.",
    {
      id: "error-concurrency",
    }
  );
