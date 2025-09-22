import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  getAboutUser,
  type GetAboutUserResponse,
} from "../../action/authAction";

interface AuthState {
  user: GetAboutUserResponse["user"] | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  loggedIn: boolean;
  message: string;
  profileFetched: boolean;
  connections: any[];
  connectionRequest: any[];
}

const initialState: AuthState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  profileFetched: false,
  connections: [],
  connectionRequest: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Processing...";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.user = action.payload.user as any;
        state.message = "Login successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          (action.payload as { message: string })?.message || "Login failed";
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Registering you...";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.user = action.payload.user as any;
        state.message = "Registration successful";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          (action.payload as { message: string })?.message ||
          "Registration failed";
      });

    // Get About User
    builder
      .addCase(getAboutUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching profile...";
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = true;
        state.user = action.payload.user;
        state.connections = action.payload.user.connections || [];
        state.connectionRequest = action.payload.user.connectionRequest || [];
        state.message = "Profile fetched";
      })
      .addCase(getAboutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          (action.payload as { message: string })?.message ||
          "Failed to fetch profile";
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
