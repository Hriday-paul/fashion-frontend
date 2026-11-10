/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface AuthState {
  user: IUser | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: { payload: { user: IUser; accessToken: string; refreshToken: string } }) => {
      const { user, accessToken, refreshToken } = action.payload;

      state.user = user;
      state.token = accessToken;

      // // Store token in Cookies for middleware authentication
      // Cookies.set("fashion-access-token", accessToken, {
      //   path: "/",
      //   expires: 7,
      // });
      // Cookies.set("fashion-refresh-token", refreshToken, {
      //   path: "/",
      //   expires: 30,
      // });



    },

    logout: (state) => {
      state.user = null;
      state.token = null;

      // Remove token from cookie
      Cookies.remove("fashion-access-token", { path: "/" });
      Cookies.remove("fashion-refresh-token", { path: "/" });
    },
  },
});

// selectors
export const selectUser = (state: any) => state.auth.user;
export const selectToken = (state: any) => state.auth.token;

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
