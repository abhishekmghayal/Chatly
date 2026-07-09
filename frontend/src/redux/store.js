import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import conversationReducer from "./conversationSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import userReducer from "./userSlice";
import messageReducer from "./messageSlice";

// Custom storage wrapper to avoid Vite CJS/ESM interop issues
const storage = {
  getItem: (key) => {
    return Promise.resolve(window.localStorage.getItem(key));
  },
  setItem: (key, item) => {
    window.localStorage.setItem(key, item);
    return Promise.resolve();
  },
  removeItem: (key) => {
    window.localStorage.removeItem(key);
    return Promise.resolve();
  },
};

const authPersistConfig = {
  key: "auth",
  storage,
};
const userPersistConfig = {
  key: "user",
  storage,
};

const conversationPersistConfig = {
  key: "conversation",
  storage,
};
const messagePersistConfig = {
  key: "message",
  storage,
};
const persistedReducer = persistReducer(authPersistConfig, authReducer);
const persistedConversationReducer = persistReducer(
  conversationPersistConfig,
  conversationReducer,
);
const persistedMessageReducer = persistReducer(
  messagePersistConfig,
  messageReducer,
);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    conversation: persistedConversationReducer,
    message: persistedMessageReducer,
    user: persistedUserReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
