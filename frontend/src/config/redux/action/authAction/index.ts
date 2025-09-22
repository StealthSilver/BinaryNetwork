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
  username: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface GetAboutUserArgs {
  token: string;
}

export interface GetAboutUserResponse {
  user: {
    id: string;
    name: string;
    email: string;
    username: string;
    profilePicture?: string;
    connections: any[];
    connectionRequest: any[];
  };
  profile: any;
}

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: { message: string } }
>("user/login", async (user: LoginPayload, thunkAPI) => {
  try {
    const response = await clientServer.post<LoginResponse>(
      "/users/login",
      user
    );

    if (response.data.token) localStorage.setItem("token", response.data.token);
    else return thunkAPI.rejectWithValue({ message: "Token not provided" });

    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data || { message: "Something went wrong" }
    );
  }
});

export const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterPayload,
  { rejectValue: { message: string } }
>("user/register", async (newUser: RegisterPayload, thunkAPI) => {
  try {
    const response = await clientServer.post<RegisterResponse>(
      "/users/register",
      newUser
    );

    if (response.data.token) localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data || { message: "Something went wrong" }
    );
  }
});

export const getAboutUser = createAsyncThunk<
  GetAboutUserResponse,
  GetAboutUserArgs,
  { rejectValue: { message: string } }
>("user/getAboutUser", async ({ token }, thunkAPI) => {
  try {
    const response = await clientServer.get<GetAboutUserResponse>(
      "/users/get_user_and_profile",
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ send token in header
        },
      }
    );

    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data || { message: "Failed to fetch user info" }
    );
  }
});
