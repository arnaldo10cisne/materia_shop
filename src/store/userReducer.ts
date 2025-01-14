import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserModel } from "../utils/models";

interface UserStateModel {
  selectedUser: UserModel | null;
}

const initialState: UserStateModel = {
  selectedUser: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserModel>) => {
      state.selectedUser = action.payload;
    },
    clearUser: (state) => {
      state.selectedUser = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
