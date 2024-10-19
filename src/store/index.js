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
import { jobConcurrencyCheck } from "./jobConcurrencyCheck";

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
    jobConcurrencyCheck,
    listenerMiddleware.middleware,
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredActionPaths: ["meta.client"],
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

export const persistor = persistStore(store);
export default store;
