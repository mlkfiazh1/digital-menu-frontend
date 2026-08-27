import { createSlice } from "@reduxjs/toolkit";

export const AUTH_STORAGE_KEY = "digital-menu.auth";

function loadAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return { token: null, expiryTime: null, user: null };
    }

    const parsed = JSON.parse(raw);
    if (
      parsed.expiryTime &&
      Date.now() > new Date(parsed.expiryTime).getTime()
    ) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return { token: null, expiryTime: null, user: null };
    }

    return {
      token: parsed.token ?? null,
      expiryTime: parsed.expiryTime ?? null,
      user: parsed.user ?? null,
    };
  } catch {
    return { token: null, expiryTime: null, user: null };
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: loadAuth(),
  reducers: {
    setCredentials(state, action) {
      state.token = action.payload.token;
      state.expiryTime = action.payload.expiryTime;
      state.user = action.payload.user;
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          token: state.token,
          expiryTime: state.expiryTime,
          user: state.user,
        }),
      );
    },
    logout(state) {
      state.token = null;
      state.expiryTime = null;
      state.user = null;
      localStorage.removeItem(AUTH_STORAGE_KEY);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => Boolean(state.auth.token);
export default authSlice.reducer;
