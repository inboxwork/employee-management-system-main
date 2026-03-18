import { User } from "@/utils/types";
import { createSlice } from "@reduxjs/toolkit";

interface InitialStateTypes {
  user: null | User;
  isAccountDeleted: boolean;
  users: User[];
  usersCount: number;
}

const initialState: InitialStateTypes = {
  user: null,
  isAccountDeleted: false,
  users: [],
  usersCount: 0,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUserData(state, action) {
      state.user = action.payload;
    },
    addUser(state, action) {
      state.users.push(action.payload)
    },
    setUsersCount(state, action) {
      state.usersCount = action.payload;
    },
    updateLoggedInUserData(state, action) {
      state.user = action.payload;
    },
    updateUserData(state, action) {
      state.users = state.users.map((user) =>
        user.id === action.payload.id ? action.payload : user
      );
    },
    deleteUserAccount(state, action) {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    setAllUsersData(state, action) {
      state.users = action.payload;
    },
  },
});

const usersReducer = usersSlice.reducer;
const usersActions = usersSlice.actions;

export { usersReducer, usersActions };
