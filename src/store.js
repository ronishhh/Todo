import { configureStore } from "@reduxjs/toolkit";
import TodoSlice from "./state/TodoSlice";

export const store = configureStore({
  reducer: {
    todo: TodoSlice,
  },
});

export default store;
