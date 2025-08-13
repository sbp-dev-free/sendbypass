import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { ProfileResponse } from "@/services/profile/types";

import { RootState } from "..";

interface AuthState {
  isAuthenticated: boolean;
  user: ProfileResponse | null;
}

const initialState: AuthState = (() => {
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      return {
        isAuthenticated: true,
        user: JSON.parse(storedUser) as ProfileResponse,
      };
    }
  }
  return {
    isAuthenticated: false,
    user: null,
  };
})();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<ProfileResponse>) {
      state.isAuthenticated = true;
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("user");
    },
    setUser(state, action: PayloadAction<ProfileResponse | null>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
