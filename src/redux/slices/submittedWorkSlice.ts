import { SubmittedWork } from "@/utils/types";
import { createSlice } from "@reduxjs/toolkit";

type InitialStateTypes = {
  submittedWork: null | SubmittedWork;
  submittedWorks: SubmittedWork[];
  submittedWorksCount: number;
};

const initialState: InitialStateTypes = {
  submittedWork: null,
  submittedWorks: [],
  submittedWorksCount: 0,
};

const submittedWorksSlice = createSlice({
  name: "submittedWorks",
  initialState,
  reducers: {
    setSubmittedWork(state, action) {
      state.submittedWork = action.payload;
    },
    setSubmittedWorksCount(state, action) {
      state.submittedWorksCount = action.payload;
    },
    addSubmittedWork(state, action) {
      state.submittedWorks.push(action.payload);
      state.submittedWorksCount += 1;
    },
    setSubmittedWorks(state, action) {
      state.submittedWorks = action.payload;
    },
    deleteSubmittedWork(state, action) {
      state.submittedWorks = state.submittedWorks.filter((submittedWork) => submittedWork.id !== action.payload);
    },
    updateSubmittedWorkData(state, action) {
      state.submittedWorks = state.submittedWorks.map((submittedWork) => submittedWork.id === action.payload.id ? action.payload : submittedWork);
    },
  },
});

const submittedWorksReducer = submittedWorksSlice.reducer;
const submittedWorksActions = submittedWorksSlice.actions;

export { submittedWorksReducer, submittedWorksActions };
