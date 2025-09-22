import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import {
  getAllPosts,
  createPost,
  deletePost,
  addComment,
  getCommentsByPost,
  incrementLikes,
  type Post,
  type Comment,
} from "../../action/postAction/index";

interface PostState {
  posts: Post[];
  comments: Record<string, Comment[]>;
  isLoading: boolean;
  isError: boolean;
  postFetched: boolean;
  message: string;
  postId: string;
}

const initialState: PostState = {
  posts: [],
  comments: {},
  isLoading: false,
  isError: false,
  postFetched: false,
  message: "",
  postId: "",
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: () => initialState,
    setPostId: (state, action: PayloadAction<string>) => {
      state.postId = action.payload;
    },
  },
  extraReducers: (builder) => {
    // 🔹 Get All Posts
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.postFetched = true;
        state.posts = action.payload;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });

    // 🔹 Create Post
    builder
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload as string;
      });

    // 🔹 Delete Post
    builder
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(
          (post) => post._id !== action.payload.postId
        );
        state.message = action.payload.message;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload as string;
      });

    // 🔹 Add Comment
    builder
      .addCase(addComment.fulfilled, (state, action) => {
        const comment = action.payload;
        if (!state.comments[comment.postId]) {
          state.comments[comment.postId] = [];
        }
        state.comments[comment.postId].unshift(comment);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload as string;
      });

    // 🔹 Get Comments by Post
    builder
      .addCase(getCommentsByPost.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        state.comments[postId] = comments;
      })
      .addCase(getCommentsByPost.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload as string;
      });

    // 🔹 Increment Likes
    builder
      .addCase(incrementLikes.fulfilled, (state, action) => {
        const { postId, likes } = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          post.likes = likes;
        }
      })
      .addCase(incrementLikes.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset, setPostId } = postSlice.actions;
export default postSlice.reducer;
