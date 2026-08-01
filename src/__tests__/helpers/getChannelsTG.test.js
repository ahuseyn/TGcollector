import { vi } from "vitest";
import { getChannelsTG } from "helpers/getChannelsTG";
import { toast } from "react-hot-toast";
import { Api } from "telegram";

vi.mock("react-hot-toast", () => ({
  toast: {
    loading: vi.fn(),
    error: vi.fn(),
  },
}));

describe("getChannelsTG", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should get full channel for each channel with delay", async () => {
    const client = {
      invoke: vi.fn(),
    };

    client.invoke.mockResolvedValueOnce({
      toJSON: () => ({ id: 1, name: "channel1" }),
    });
    client.invoke.mockResolvedValueOnce({
      toJSON: () => ({ id: 2, name: "channel2" }),
    });

    const channels = ["chan1", "chan2"];
    
    const promise = getChannelsTG(client, channels);
    
    vi.advanceTimersByTime(300); // Fast-forward time for the intervals
    
    const result = await promise;

    expect(client.invoke).toHaveBeenCalledTimes(2);
    expect(toast.loading).toHaveBeenCalledTimes(2);
    expect(result).toEqual([
      { handle: "chan1", data: { id: 1, name: "channel1" } },
      { handle: "chan2", data: { id: 2, name: "channel2" } },
    ]);
  });

  it("should handle error during getFullChannel", async () => {
    const client = {
      invoke: vi.fn(),
    };

    client.invoke.mockRejectedValueOnce(new Error("channel not found"));

    const channels = ["chan1"];
    const promise = getChannelsTG(client, channels);
    
    vi.advanceTimersByTime(0);
    
    const result = await promise;

    expect(toast.error).toHaveBeenCalled();
    expect(result).toEqual([undefined]); // The catch block doesn't return anything
  });
});
