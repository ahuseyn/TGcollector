import {
  configureStore,
  createListenerMiddleware,
  isAnyOf,
} from "@reduxjs/toolkit";
// import logger from "redux-logger";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import reducer, { insertJob, resumeJob } from "store/reducers/root";
import { collectMessages } from "./effects/collectMessages";
import { postRehydrate } from "./effects/postRehydrate";

// Configure and initiate Redux persist
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, reducer);

// Initiate store with listener middleware
const listenerMiddleware = createListenerMiddleware();

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => [
    listenerMiddleware.middleware,
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    // logger,
  ],
});

// Listen for insertJob action and run collectMessages side effect
listenerMiddleware.startListening({
  matcher: isAnyOf(insertJob, resumeJob),
  effect: collectMessages,
});

// Listen for persist/REHYDRATE action and do postRehydrate actions
listenerMiddleware.startListening({
  type: "persist/REHYDRATE",
  effect: postRehydrate,
});

export const persistor = persistStore(store);
export default store;
