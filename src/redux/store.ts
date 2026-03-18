import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { usersReducer } from "./slices/usersSlice";
import { tasksReducer } from "./slices/tasksSlice";
import { submittedWorksReducer } from "./slices/submittedWorkSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    tasks: tasksReducer,
    submittedWork: submittedWorksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
