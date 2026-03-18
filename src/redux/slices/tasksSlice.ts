import { Task } from "@/utils/types";
import { createSlice } from "@reduxjs/toolkit";

type InitialStateTypes = {
  task: null | Task;
  tasks: Task[];
  tasksCount: number;
};

const initialState: InitialStateTypes = {
  task: null,
  tasks: [],
  tasksCount: 0,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTask(state, action) {
      state.task = action.payload;
    },
    setTasksCount(state, action) {
      state.tasksCount = action.payload;
    },
    addTask(state, action) {
      state.tasks.push(action.payload);
      state.tasksCount += 1;
    },
    setTasks(state, action) {
      state.tasks = action.payload;
    },
    deleteTask(state, action) {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    updateTaskData(state, action) {
      state.tasks = state.tasks.map((task) => task.id === action.payload.id ? action.payload : task);
    },
  },
});

const tasksReducer = tasksSlice.reducer;
const tasksActions = tasksSlice.actions;

export { tasksReducer, tasksActions };
