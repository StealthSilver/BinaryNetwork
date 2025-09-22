import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../config/redux/store";
import {
  getAllPosts,
  createPost,
} from "../config/redux/action/postAction/index";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const authState = useSelector((state: RootState) => state.auth);
  const postState = useSelector((state: RootState) => state.post);

  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      dispatch(getAllPosts());
    }
  }, [dispatch, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;

    const formData = new FormData();
    formData.append("body", description);
    if (image) formData.append("media", image);

    dispatch(createPost(formData));
    setDescription("");
    setImage(null);
    setPreview(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-5 gap-6 p-6">
        {/* Left Sidebar */}
        <div className="sm:col-span-1 md:col-span-1 bg-white shadow rounded-2xl p-4 space-y-6">
          {/* User Profile */}
          <div className="flex flex-col items-center text-center">
            <img
              src={
                authState.user?.profilePicture ||
                "https://via.placeholder.com/100"
              }
              alt="avatar"
              className="w-20 h-20 rounded-full shadow-md"
            />
            <h2 className="mt-3 text-lg font-semibold text-gray-800">
              {authState.user?.name}
            </h2>
            <p className="text-sm text-gray-500">{authState.user?.email}</p>
          </div>

          {/* Connections */}
          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-2">
              Connections
            </h3>
            <ul className="space-y-2">
              {[1, 2, 3].map((i) => (
                <li key={i} className="flex items-center space-x-2">
                  <img
                    src={`https://i.pravatar.cc/40?img=${i}`}
                    alt="friend"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-gray-700 text-sm">Friend {i}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* My Posts */}
          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-2">
              My Posts
            </h3>
            <ul className="space-y-2">
              {postState.posts
                .filter((p) => p.userId._id === authState.user?.id)
                .slice(0, 3)
                .map((post) => (
                  <li
                    key={post._id}
                    className="p-2 bg-gray-50 rounded-lg text-sm text-gray-600 truncate"
                  >
                    {post.body}
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Feed (Center) */}
        <div className="col-span-2 bg-white p-4 rounded-2xl shadow-md">
          <h2 className="text-lg font-bold mb-4">Feed</h2>

          {postState.isLoading && <p>Loading posts...</p>}
          {postState.isError && (
            <p className="text-red-500">{postState.message}</p>
          )}

          {postState.posts.length > 0 ? (
            <div className="space-y-4">
              {postState.posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-gray-50 rounded-xl p-4 shadow-sm"
                >
                  {/* Creator Info */}
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={post.userId.profilePicture || "/avatar.png"}
                      alt={post.userId.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{post.userId.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Post Body */}
                  <p className="mb-2">{post.body}</p>

                  {/* Post Media */}
                  {post.media && (
                    <img
                      src={post.media}
                      alt="post media"
                      className="rounded-xl w-full object-cover max-h-96"
                    />
                  )}

                  {/* Likes */}
                  <p className="text-sm text-gray-500 mt-2">
                    ❤️ {post.likes ?? 0} Likes
                  </p>
                </div>
              ))}
            </div>
          ) : (
            !postState.isLoading && <p>No posts yet.</p>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="sm:col-span-1 md:col-span-1 bg-white shadow rounded-2xl p-4 space-y-6">
          {/* Notifications */}
          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-2">
              Notifications
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>🔔 You have a new follower</li>
              <li>👍 Your post got 3 likes</li>
              <li>💬 Someone commented on your post</li>
            </ul>
          </div>

          {/* Create Post */}
          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-2">
              Create a Post
            </h3>
            <form
              onSubmit={handleSubmit}
              className="space-y-3"
              encType="multipart/form-data"
            >
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-200"
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block text-sm text-gray-500"
              />

              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full rounded-lg shadow"
                />
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700 transition"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
