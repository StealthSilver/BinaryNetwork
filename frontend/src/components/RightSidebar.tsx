import React, { useState } from "react";

interface RightSidebarProps {
  onCreatePost: (description: string, image: File | null) => void;
}

export default function RightSidebar({ onCreatePost }: RightSidebarProps) {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

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

    onCreatePost(description, image);

    setDescription("");
    setImage(null);
    setPreview(null);
  };

  return (
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
  );
}
