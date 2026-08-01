import { vi } from "vitest";
import { getActiveJob } from "helpers/getActiveJob";
import { postRehydrate } from "store/effects/postRehydrate";
import { onResumeJob } from "store/reducers/root";

vi.mock("store/reducers/root", () => ({
  onResumeJob: vi.fn((payload) => ({ type: "onResumeJob", payload })),
}));

describe("getActiveJob", () => {
  test("returns progress job when available", () => {
    const jobs = {
      a: { id: "a", status: "paused" },
      b: { id: "b", status: "progress" },
    };

    expect(getActiveJob(jobs)).toEqual({ id: "a", status: "paused" });
    expect(getActiveJob(jobs, false)).toEqual({ id: "b", status: "progress" });
  });

  test("returns undefined when only paused jobs are present and paused are excluded", () => {
    const jobs = {
      a: { id: "a", status: "paused" },
    };

    expect(getActiveJob(jobs, false)).toBeUndefined();
  });
});

describe("postRehydrate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("dispatches resume action for an active progress job", async () => {
    const jobs = {
      pausedJob: {
        id: "pausedJob",
        name: "Paused",
        status: "paused",
        params: { channels: [] },
        current: {},
      },
      progressJob: {
        id: "progressJob",
        name: "In Progress",
        status: "progress",
        params: { channels: ["a"] },
        current: { offset: 20 },
      },
    };

    const dispatch = vi.fn();

    await postRehydrate({ payload: { jobs } }, { dispatch });

    expect(onResumeJob).toHaveBeenCalledWith({
      id: "progressJob",
      name: "In Progress",
      params: { channels: ["a"] },
      current: { offset: 20 },
    });
    expect(dispatch).toHaveBeenCalledWith(onResumeJob.mock.results[0].value);
  });

  test("does not dispatch when there is no progress job", async () => {
    const dispatch = vi.fn();
    const jobs = {
      pausedJob: {
        id: "pausedJob",
        name: "Paused",
        status: "paused",
        params: {},
        current: {},
      },
    };

    await postRehydrate({ payload: { jobs } }, { dispatch });

    expect(onResumeJob).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });
});
