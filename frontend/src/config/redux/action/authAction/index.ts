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
  LoginResponse, // Return type of fulfilled
  LoginPayload, // Argument type
  { rejectValue: { message: string } } // reject type
>("user/login", async (user: LoginPayload, thunkAPI) => {
  try {
    const response = await clientServer.post<LoginResponse>("/login", {
      email: user.email,
      password: user.password,
    });

    // Now TypeScript knows response.data has type LoginResponse
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    } else {
      return thunkAPI.rejectWithValue({ message: "Token not provided" });
    }

    return response.data; // TypeScript knows this is LoginResponse
  } catch (error: any) {
    const errMsg = error?.response?.data || { message: "Something went wrong" };
    return thunkAPI.rejectWithValue(errMsg);
  }
});
