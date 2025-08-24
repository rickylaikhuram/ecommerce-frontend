import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../utils/axios";
interface UserState {
  user: UserProfile | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

const initialState: UserState = {
  user: null,
  status: "idle",
  error: null,
};
// Fetch user details
export const fetchProfile = createAsyncThunk("user/fetchProfile", async () => {
  const response = await instance.get("/api/user/profile");
  return response.data.user;
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProfile.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Something went wrong";
    });
  },
});

export default userSlice.reducer;
