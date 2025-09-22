import React, { useState } from "react";
import {
  Star,
  Clock,
  Users,
  Bell,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";

interface RightSidebarProps {
  onCreatePost: (description: string, image: File | null) => void;
  onGetPremium?: () => void;
}

const dummyNews = [
  {
    id: 1,
    headline: "React 20 Released!",
    timeAgo: "2h ago",
    readers: "1.5k readers",
    topStory: true,
  },
  {
    id: 2,
    headline: "TypeScript 6 Features",
    timeAgo: "4h ago",
    readers: "900 readers",
    topStory: true,
  },
  {
    id: 3,
    headline: "Next.js 14 Beta",
    timeAgo: "6h ago",
    readers: "2.2k readers",
    topStory: false,
  },
  {
    id: 4,
    headline: "Tailwind v4 Preview",
    timeAgo: "8h ago",
    readers: "1.1k readers",
    topStory: false,
  },
  {
    id: 5,
    headline: "Redux Toolkit Tips",
    timeAgo: "12h ago",
    readers: "750 readers",
    topStory: false,
  },
];

export default function RightSidebar({
  onCreatePost,
  onGetPremium,
}: RightSidebarProps) {
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
      <section>
        <h3 className="text-md font-semibold text-gray-700 mb-2">
          Notifications
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-gray-500" />
            <span>You have a new follower</span>
          </li>
          <li className="flex items-center space-x-2">
            <ThumbsUp className="w-4 h-4 text-gray-500" />
            <span>Your post got 3 likes</span>
          </li>
          <li className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-gray-500" />
            <span>Someone commented on your post</span>
          </li>
        </ul>
      </section>

      <section>
        <h3 className="text-md font-semibold text-gray-700 mb-3">News</h3>

        <div className="space-y-2 mb-3">
          {dummyNews
            .filter((n) => n.topStory)
            .map((news) => (
              <div
                key={news.id}
                className="p-3 bg-yellow-50 rounded-lg shadow hover:bg-yellow-100 cursor-pointer transition"
                aria-label={`Top story: ${news.headline}`}
              >
                <p className="font-semibold text-gray-800">{news.headline}</p>
                <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                  <Clock className="w-3 h-3" /> <span>{news.timeAgo}</span>
                  <Users className="w-3 h-3" /> <span>{news.readers}</span>
                </div>
              </div>
            ))}
        </div>

        <div className="space-y-2">
          {dummyNews
            .filter((n) => !n.topStory)
            .map((news) => (
              <div
                key={news.id}
                className="p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                aria-label={`News item: ${news.headline}`}
              >
                <p className="font-semibold text-gray-700">{news.headline}</p>
                <div className="flex items-center text-xs text-gray-500 mt-0.5 space-x-2">
                  <Clock className="w-3 h-3" /> <span>{news.timeAgo}</span>
                  <Users className="w-3 h-3" /> <span>{news.readers}</span>
                </div>
              </div>
            ))}
        </div>
      </section>

      <section>
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
      </section>

      <section>
        <button
          onClick={onGetPremium}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-3 rounded-lg shadow hover:from-yellow-500 hover:to-yellow-700 transition flex items-center justify-center space-x-2"
          aria-label="Get Premium"
        >
          <Star className="w-4 h-4" /> <span>Get Premium</span>
        </button>
      </section>
    </div>
  );
}
