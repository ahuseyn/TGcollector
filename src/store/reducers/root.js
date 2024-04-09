import { createSlice } from "@reduxjs/toolkit";
import { concurrencyError } from "helpers/concurrencyError";
import { getActiveJob } from "helpers/getActiveJob";

const defaultUser = {
  remember: false,
  logged: false,
  session: "",
  api: "",
  userInfo: {},
};

const collectionSlice = createSlice({
  name: "root",
  initialState: {
    collections: {},
    folders: {},
    jobs: {},
    user: defaultUser,
    auth: {
      askLogin: false,
      key: "",
    },
    client: null,
    theme: "light",
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    insertCollection: (state, action) => {
      Object.assign(state.collections, action.payload);
    },
    insertJob: (state, action) => {
      Object.assign(state.jobs, { [action.payload.id]: action.payload });
    },
    resumeJob: (state, action) => {
      const { id } = action.payload;

      state.jobs[id] = {
        ...state.jobs[id],
        status: "progress",
        error: undefined,
      };
    },
    updateJob: (state, action) => {
      const { id, data } = action.payload;

      state.jobs[id] = { ...state.jobs[id], ...data };
    },
    stopJob: (state, action) => {
      const { id, status, error } = action.payload;

      state.jobs[id] = {
        ...state.jobs[id],
        canceled: status === "canceled",
        status, // paused, canceled or error
        error,
      };
    },
    initClient: (state, action) => {
      state.client = action.payload;
    },
    apiLogin: (state, action) => {
      state.user = action.payload;
    },
    apiLogout: (state) => {
      state.user = defaultUser;
    },
    setAskLogin: (state, action) => {
      state.auth = { ...state.auth, askLogin: action.payload };
    },
    renameCollection: (state, action) => {
      const { id, text } = action.payload;
      state.collections[id].title = text;
    },
    deleteCollection: (state, action) => {
      delete state.collections[action.payload.id];
      action.payload.jobs.forEach((job) => {
        delete state.jobs[job];
      });
    },
    deleteJob: (state, action) => {
      delete state.jobs[action.payload];
    },
    insertChannel: (state, action) => {
      const { colId, channels } = action.payload;
      Object.assign(state.collections[colId].channels, channels);
    },
    deleteChannel: (state, action) => {
      const { colId, chnId } = action.payload;
      delete state.collections[colId].channels[chnId];
    },
    insertFolders: (state, action) => ({
      ...state,
      folders: action.payload,
    }),
  },
});

const { actions, reducer } = collectionSlice;

// Check jobs, resume job if none is active
export const onResumeJob = (payload) => (dispatch, getState) => {
  const jobs = getState().jobs;
  const activeJob = getActiveJob(jobs);

  // Resume only active(paused) job
  if (activeJob && activeJob.id !== payload.id) return concurrencyError();

  dispatch(resumeJob(payload));
};

export const {
  insertCollection,
  renameCollection,
  deleteCollection,
  insertChannel,
  deleteChannel,
  insertFolders,
  insertJob,
  updateJob,
  apiLogin,
  setAskLogin,
  apiLogout,
  stopJob,
  initClient,
  toggleTheme,
  deleteJob,
  resumeJob,
} = actions;

export default reducer;
