import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../config/redux/store";

interface LeftSidebarProps {
  posts: any[];
}

export default function LeftSidebar({ posts }: LeftSidebarProps) {
  const authState = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const handleProfileClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="sm:col-span-1 md:col-span-1 bg-white shadow rounded-2xl p-4 space-y-6">
      {/* User Info */}
      <div className="flex flex-col items-center text-center">
        <img
          src={
            authState.user?.profilePicture
              ? `/uploads/${authState.user.profilePicture}`
              : "https://via.placeholder.com/100"
          }
          alt="avatar"
          className="w-20 h-20 rounded-full shadow-md"
        />
        <h2
          className="mt-3 text-lg font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
          onClick={() => handleProfileClick(authState.user?.id)}
        >
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
        <h3 className="text-md font-semibold text-gray-700 mb-2">My Posts</h3>
        <ul className="space-y-2">
          {posts
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
  );
}
