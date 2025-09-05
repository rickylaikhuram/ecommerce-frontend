import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../utils/axios";

export interface DecodedToken {
  uid: string;
  role: "admin" | "guest" | "user";
  isAdmin: boolean;
}

interface AuthState {
  status: "idle" | "loading" | "succeeded" | "failed";
  user: DecodedToken | null;
  error: string | null;
  isLoggingOut: boolean;
}

const initialState: AuthState = {
  status: "idle",
  user: null,
  error: null,
  isLoggingOut: false,
};

// Fetch auth details
export const fetchAuth = createAsyncThunk("auth/fetchAuth", async () => {
  const response = await instance.get("/api/auth/me");
  localStorage.setItem("authToken", response.data.token);
  return response.data.user;
});

// Logout user
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  const response = await instance.post("/api/auth/logout");
  localStorage.removeItem("authToken");
  return response.data.message;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAuth.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchAuth.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(fetchAuth.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Something went wrong";
    });
    // Logout handlers
    builder.addCase(logoutUser.pending, (state) => {
      state.status = "loading";
      state.isLoggingOut = true;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.status = "idle";
      state.user = null;
      state.error = null;
      state.isLoggingOut = false;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Logout failed";
      state.isLoggingOut = false;
    });
  },
});

export default authSlice.reducer;
