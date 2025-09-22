import React, { useState, useRef } from "react";
import Modal from "./Modal";
import { useSelector } from "react-redux";
import type { RootState } from "../config/redux/store";
import { Paperclip, X } from "lucide-react";

interface CreatePostProps {
  onPost: (description: string, image: File | null) => Promise<void>;
}

export default function CreatePost({ onPost }: CreatePostProps) {
  const authState = useSelector((state: RootState) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be smaller than 5MB");
        return;
      }
      setImage(file);
    }
  };

  const handleRemoveImage = () => setImage(null);

  const handleSubmit = async () => {
    if (!description.trim() && !image) return;
    setLoading(true);
    try {
      await onPost(description, image);
      setDescription("");
      setImage(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <div
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow hover:shadow-md cursor-pointer transition"
      >
        <img
          src={
            authState.user?.profilePicture
              ? `/uploads/${authState.user.profilePicture}`
              : "/favicon.svg"
          }
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1 text-gray-500">Start a post...</div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex items-center gap-3 mb-4">
          <img
            src={
              authState.user?.profilePicture
                ? `/uploads/${authState.user.profilePicture}`
                : "/favicon.svg"
            }
            alt="avatar"
            className="w-12 h-12 rounded-full"
          />
          <p className="font-semibold text-gray-800">{authState.user?.name}</p>
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What do you want to talk about?"
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring focus:ring-blue-200 mb-3 resize-none"
          rows={5}
        />

        <div className="mb-3">
          {image ? (
            <div className="relative inline-block">
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="max-h-64 rounded-xl object-cover"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-800">
              <Paperclip className="w-5 h-5" />
              <span>Attach Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                ref={inputRef}
              />
            </label>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || (!description.trim() && !image)}
            className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
