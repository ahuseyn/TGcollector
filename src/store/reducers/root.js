import { createSlice } from "@reduxjs/toolkit";

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
      Object.assign(state.jobs, action.payload);
    },
    updateJob: (state, action) => {
      const { id, data } = action.payload;

      state.jobs[id] = { ...state.jobs[id], ...data };
    },
    cancelJob: (state, action) => {
      const id = action.payload;

      state.jobs[id] = {
        ...state.jobs[id],
        canceled: true,
        status: "canceled",
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
  },
});

const { actions, reducer } = collectionSlice;

export const {
  insertCollection,
  renameCollection,
  deleteCollection,
  insertChannel,
  deleteChannel,
  insertJob,
  updateJob,
  apiLogin,
  setAskLogin,
  apiLogout,
  cancelJob,
  initClient,
  toggleTheme,
  deleteJob,
} = actions;

export default reducer;
