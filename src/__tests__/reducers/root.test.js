import { vi } from "vitest";
import reducer, {
  insertCollection,
  renameCollection,
  deleteCollection,
  insertChannel,
  deleteChannel,
  insertFolders,
  insertJob,
  updateJob,
  stopJob,
  apiLogin,
  apiLogout,
  setAskLogin,
  toggleTheme,
  deleteJob,
  resumeJob,
  onResumeJob
} from "store/reducers/root";
import * as getActiveJobHelper from "helpers/getActiveJob";
import * as concurrencyErrorHelper from "helpers/concurrencyError";

describe("Root Reducer", () => {
  const initialState = {
    collections: {},
    folders: {},
    jobs: {},
    user: {
      remember: false,
      logged: false,
      session: "",
      api: "",
      userInfo: {},
    },
    auth: {
      askLogin: false,
      key: "",
    },
    client: null,
    theme: "light",
  };

  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle toggleTheme", () => {
    const actual = reducer(initialState, toggleTheme());
    expect(actual.theme).toEqual("dark");
    const toggledBack = reducer(actual, toggleTheme());
    expect(toggledBack.theme).toEqual("light");
  });

  it("should handle insertCollection", () => {
    const newCollection = { col1: { id: "col1", title: "Test" } };
    const actual = reducer(initialState, insertCollection(newCollection));
    expect(actual.collections).toEqual(newCollection);
  });

  it("should handle renameCollection", () => {
    const state = {
      ...initialState,
      collections: { col1: { id: "col1", title: "Test" } },
    };
    const actual = reducer(state, renameCollection({ id: "col1", text: "New Test" }));
    expect(actual.collections.col1.title).toEqual("New Test");
  });

  it("should handle deleteCollection", () => {
    const state = {
      ...initialState,
      collections: { col1: { id: "col1", title: "Test" } },
      jobs: { job1: { id: "job1" } },
    };
    const actual = reducer(state, deleteCollection({ id: "col1", jobs: ["job1"] }));
    expect(actual.collections.col1).toBeUndefined();
    expect(actual.jobs.job1).toBeUndefined();
  });

  it("should handle insertChannel", () => {
    const state = {
      ...initialState,
      collections: { col1: { id: "col1", channels: {} } },
    };
    const actual = reducer(state, insertChannel({ colId: "col1", channels: { ch1: {} } }));
    expect(actual.collections.col1.channels.ch1).toBeDefined();
  });

  it("should handle deleteChannel", () => {
    const state = {
      ...initialState,
      collections: { col1: { id: "col1", channels: { ch1: {} } } },
    };
    const actual = reducer(state, deleteChannel({ colId: "col1", chnId: "ch1" }));
    expect(actual.collections.col1.channels.ch1).toBeUndefined();
  });

  it("should handle insertFolders", () => {
    const actual = reducer(initialState, insertFolders({ folder1: {} }));
    expect(actual.folders).toEqual({ folder1: {} });
  });

  it("should handle insertJob", () => {
    const actual = reducer(initialState, insertJob({ id: "job1" }));
    expect(actual.jobs.job1).toEqual({ id: "job1" });
  });

  it("should handle updateJob", () => {
    const state = {
      ...initialState,
      jobs: { job1: { id: "job1", status: "paused" } },
    };
    const actual = reducer(state, updateJob({ id: "job1", data: { status: "progress" } }));
    expect(actual.jobs.job1.status).toEqual("progress");
  });

  it("should handle stopJob", () => {
    const state = {
      ...initialState,
      jobs: { job1: { id: "job1", status: "progress" } },
    };
    const actual = reducer(state, stopJob({ id: "job1", status: "canceled", error: "test error" }));
    expect(actual.jobs.job1.canceled).toBe(true);
    expect(actual.jobs.job1.status).toBe("canceled");
    expect(actual.jobs.job1.error).toBe("test error");
  });

  it("should handle resumeJob", () => {
    const state = {
      ...initialState,
      jobs: { job1: { id: "job1", status: "paused", error: "err" } },
    };
    const actual = reducer(state, resumeJob({ id: "job1" }));
    expect(actual.jobs.job1.status).toBe("progress");
    expect(actual.jobs.job1.error).toBeUndefined();
  });

  it("should handle deleteJob", () => {
    const state = {
      ...initialState,
      jobs: { job1: { id: "job1" } },
    };
    const actual = reducer(state, deleteJob("job1"));
    expect(actual.jobs.job1).toBeUndefined();
  });

  it("should handle apiLogin", () => {
    const user = { logged: true };
    const actual = reducer(initialState, apiLogin(user));
    expect(actual.user).toEqual(user);
  });

  it("should handle apiLogout", () => {
    const state = {
      ...initialState,
      user: { logged: true },
    };
    const actual = reducer(state, apiLogout());
    expect(actual.user.logged).toBe(false);
  });

  it("should handle setAskLogin", () => {
    const actual = reducer(initialState, setAskLogin(true));
    expect(actual.auth.askLogin).toBe(true);
  });
});

describe("onResumeJob Thunk", () => {
  it("should resume job if no active job", () => {
    const dispatch = vi.fn();
    const getState = () => ({ jobs: {} });
    vi.spyOn(getActiveJobHelper, "getActiveJob").mockReturnValue(null);
    
    onResumeJob({ id: "job1" })(dispatch, getState);
    
    expect(dispatch).toHaveBeenCalled();
    const action = dispatch.mock.calls[0][0];
    expect(action.type).toBe("root/resumeJob");
    expect(action.payload).toEqual({ id: "job1" });
  });

  it("should throw concurrency error if there is an active job not equal to payload.id", () => {
    const dispatch = vi.fn();
    const getState = () => ({ jobs: {} });
    vi.spyOn(getActiveJobHelper, "getActiveJob").mockReturnValue({ id: "job2" });
    const concurrencySpy = vi.spyOn(concurrencyErrorHelper, "concurrencyError").mockReturnValue("error");
    
    onResumeJob({ id: "job1" })(dispatch, getState);
    
    expect(dispatch).not.toHaveBeenCalled();
    expect(concurrencySpy).toHaveBeenCalled();
  });

  it("should resume job if active job is the same", () => {
    const dispatch = vi.fn();
    const getState = () => ({ jobs: {} });
    vi.spyOn(getActiveJobHelper, "getActiveJob").mockReturnValue({ id: "job1" });
    
    onResumeJob({ id: "job1" })(dispatch, getState);
    
    expect(dispatch).toHaveBeenCalled();
  });
});
