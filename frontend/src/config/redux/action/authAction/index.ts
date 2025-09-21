import { createAsyncThunk } from "@reduxjs/toolkit";
import clientServer from "../../../index";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// Login Thunk
export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: { message: string } }
>("user/login", async (user: LoginPayload, thunkAPI) => {
  try {
    const response = await clientServer.post<LoginResponse>("/login", user);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    } else {
      return thunkAPI.rejectWithValue({ message: "Token not provided" });
    }

    return response.data;
  } catch (error: any) {
    const errMsg = error?.response?.data || { message: "Something went wrong" };
    return thunkAPI.rejectWithValue(errMsg);
  }
});

// Register Thunk
export const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterPayload,
  { rejectValue: { message: string } }
>("user/register", async (newUser: RegisterPayload, thunkAPI) => {
  try {
    const response = await clientServer.post<RegisterResponse>(
      "/register",
      newUser
    );
    return response.data;
  } catch (error: any) {
    const errMsg = error?.response?.data || { message: "Something went wrong" };
    return thunkAPI.rejectWithValue(errMsg);
  }
});
