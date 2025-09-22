import { createAsyncThunk } from "@reduxjs/toolkit";
import clientServer from "../../../index";

export interface User {
  _id: string;
  name: string;
  username: string;
  profilePicture?: string;
}

export interface Post {
  _id: string;
  body: string;
  media?: string;
  fileType?: string;
  likes: number;
  userId: User;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  postId: string;
  body: string;
  userId: User;
  createdAt: string;
}

export const getAllPosts = createAsyncThunk<Post[]>(
  "post/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get<{ posts: Post[] }>("/posts");
      return response.data.posts;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ?? "Failed to fetch posts"
      );
    }
  }
);

export const createPost = createAsyncThunk<Post, FormData>(
  "post/createPost",
  async (formData, thunkAPI) => {
    try {
      const response = await clientServer.post<{ post: Post }>(
        "/posts",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data.post;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ?? "Failed to create post"
      );
    }
  }
);

export const deletePost = createAsyncThunk<
  { postId: string; message: string },
  string
>("post/deletePost", async (postId, thunkAPI) => {
  try {
    const response = await clientServer.delete<{ message: string }>("/posts", {
      data: { post_id: postId },
    } as any);
    return { postId, message: response.data.message };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ?? "Failed to delete post"
    );
  }
});

export const addComment = createAsyncThunk<
  Comment,
  { postId: string; body: string }
>("post/addComment", async ({ postId, body }, thunkAPI) => {
  try {
    const response = await clientServer.post<{ comment: Comment }>(
      "/posts/comment",
      {
        postId,
        body,
      }
    );
    return response.data.comment;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ?? "Failed to add comment"
    );
  }
});

export const getCommentsByPost = createAsyncThunk<
  { postId: string; comments: Comment[] },
  string
>("post/getCommentsByPost", async (postId, thunkAPI) => {
  try {
    const response = await clientServer.get<{ comments: Comment[] }>(
      `/posts/comments/${postId}`
    );
    return { postId, comments: response.data.comments };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ?? "Failed to fetch comments"
    );
  }
});

export const incrementLikes = createAsyncThunk<
  { postId: string; likes: number },
  string
>("post/incrementLikes", async (postId, thunkAPI) => {
  try {
    const response = await clientServer.post<{ likes: number; postId: string }>(
      "/posts/like",
      { postId }
    );
    return { postId: response.data.postId, likes: response.data.likes };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ?? "Failed to like post"
    );
  }
});
