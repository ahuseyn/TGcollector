import { vi } from "vitest";
import { getClient } from "client/getClient";
import { getHistory } from "helpers/getHistory";
import { openDB } from "idb";
import toast from "react-hot-toast";
import { collectMessages } from "store/effects/collectMessages";
import { stopJob, updateJob } from "store/reducers/root";

vi.mock("client/getClient", () => ({
  getClient: vi.fn(),
}));

vi.mock("helpers/getHistory", () => ({
  getHistory: vi.fn(),
}));

vi.mock("idb", () => ({
  openDB: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock("store/reducers/root", () => {
  const stopJob = vi.fn((payload) => ({ type: "stopJob", payload }));
  stopJob.match = vi.fn((action) => action?.type === "stopJob");

  const updateJob = vi.fn((payload) => ({ type: "updateJob", payload }));

  return {
    stopJob,
    updateJob,
  };
});

const createHarness = ({
  aborted = false,
  waitForChild = true,
  onDelay,
} = {}) => {
  const dispatch = vi.fn();
  const signal = { aborted };
  let childPromise = Promise.resolve();

  const delay = vi.fn(async (ms) => {
    if (onDelay) onDelay({ ms, signal });
  });

  const cancel = vi.fn(() => {
    signal.aborted = true;
  });

  const fork = vi.fn((runner) => {
    childPromise = runner({ delay, signal });
    return { cancel };
  });

  const condition = vi.fn(async () => {
    if (waitForChild) await childPromise;
    return true;
  });

  return {
    dispatch,
    getState: vi.fn(() => ({ user: { id: "user-1" } })),
    fork,
    condition,
    delay,
    cancel,
  };
};

const baseAction = {
  payload: {
    id: "job-1",
    params: {
      channels: ["sample_channel"],
      fields: ["id", "message"],
      limit: 1,
      interval: 0,
    },
  },
};

const withTimeout = (promise, timeoutMs = 5000) =>
  Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error(`Test timed out after ${timeoutMs}ms`)),
        timeoutMs,
      );
    }),
  ]);

describe("collectMessages", () => {
  const mockDb = { add: vi.fn() };
  let consoleErrorSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.add.mockReset();
    getClient.mockResolvedValue({ client: true });
    getHistory.mockResolvedValue({ messages: [], chats: [], count: 0 });
    openDB.mockResolvedValue(mockDb);
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test("collects messages, updates progress, and finishes successfully", async () => {
    getHistory
      .mockResolvedValueOnce({
        messages: [{ id: 10, message: "hello", className: "Message" }],
        chats: [],
        count: 1,
      })
      .mockResolvedValueOnce({
        messages: [],
        chats: [],
        count: 1,
      });

    const harness = createHarness();

    await withTimeout(collectMessages(baseAction, harness));

    expect(getClient).toHaveBeenCalledWith({ id: "user-1" });
    expect(getHistory).toHaveBeenCalledTimes(2);
    expect(openDB).toHaveBeenCalledTimes(2);
    expect(mockDb.add).toHaveBeenCalledWith("messages", [
      expect.objectContaining({
        id: 10,
        message: "hello",
        channel: "sample_channel",
      }),
    ]);

    expect(updateJob).toHaveBeenNthCalledWith(1, {
      id: "job-1",
      data: expect.objectContaining({
        status: "progress",
      }),
    });
    expect(updateJob).toHaveBeenNthCalledWith(3, {
      id: "job-1",
      data: expect.objectContaining({
        status: "success",
        complete: true,
      }),
    });

    expect(toast.success).toHaveBeenCalledWith("Messages collected", {
      id: "info-collect",
    });
    expect(harness.condition).toHaveBeenCalledWith(stopJob.match);
    expect(harness.cancel).toHaveBeenCalledTimes(1);
  });

  test("handles history failures by dispatching error stop action", async () => {
    getHistory.mockRejectedValueOnce(new Error("boom")).mockResolvedValue({
      messages: [],
      chats: [],
      count: 0,
    });

    const harness = createHarness({
      onDelay: ({ signal }) => {
        signal.aborted = true;
      },
    });

    await withTimeout(collectMessages(baseAction, harness));

    expect(stopJob).toHaveBeenCalledWith({
      id: "job-1",
      status: "error",
      error: "Error: boom",
    });
    expect(toast.error).toHaveBeenCalledWith(
      expect.stringContaining("Error on message collection"),
      { id: "info-collect" },
    );
  });

  test("returns early when canceled signal is already set", async () => {
    getHistory.mockResolvedValue({
      messages: [{ id: 1, message: "x", className: "Message" }],
      chats: [],
      count: 1,
    });

    const harness = createHarness({ aborted: true, waitForChild: false });

    await withTimeout(collectMessages(baseAction, harness));

    const dispatched = harness.dispatch.mock.calls.map(([a]) => a);
    expect(dispatched).toEqual([]);
    expect(toast.success).not.toHaveBeenCalled();
  });

  test("aborts an in-flight history request before it can update state", async () => {
    let resolveHistory;

    getHistory.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveHistory = resolve;
      }),
    );

    const harness = createHarness({ aborted: false, waitForChild: false });

    const collectPromise = withTimeout(collectMessages(baseAction, harness));

    await Promise.resolve();
    await Promise.resolve();

    resolveHistory({
      messages: [{ id: 11, message: "pending", className: "Message" }],
      chats: [],
      count: 1,
    });

    await collectPromise;

    expect(stopJob).not.toHaveBeenCalled();
    expect(updateJob).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(harness.cancel).toHaveBeenCalledTimes(1);
  });
});
