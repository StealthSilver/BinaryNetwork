import clientServer from "../../../index";
import { createAsyncThunk } from "@reduxjs/toolkit";

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

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: { message: string } }
>("user/login", async (user: LoginPayload, thunkAPI) => {
  try {
    const response = await clientServer.post<LoginResponse>("/login", {
      email: user.email,
      password: user.password,
    });

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
