import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../config/redux/store";

interface LeftSidebarProps {
  totalConnections?: number;
  totalRequests?: number;
  profileViews?: number;
}

export default function LeftSidebar({
  totalConnections = 0,
  totalRequests = 0,
  profileViews = 0,
}: LeftSidebarProps) {
  const authState = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const handleProfileClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const quickAccessOptions = [
    { label: "Saved Items", onClick: () => navigate("/saved") },
    { label: "Groups", onClick: () => navigate("/groups") },
    { label: "Newsletter", onClick: () => navigate("/newsletter") },
    { label: "Events", onClick: () => navigate("/events") },
  ];

  return (
    <div className="sm:col-span-1 md:col-span-1 space-y-6">
      {/* User Info */}
      <section className="bg-white shadow rounded-2xl p-4 flex flex-col items-center text-center">
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
      </section>

      {/* Connections & Requests */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-white shadow rounded-2xl p-4 flex flex-col items-center">
          <span className="text-xl font-bold text-gray-800">
            {totalConnections.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">Connections</span>
        </div>
        <div className="bg-white shadow rounded-2xl p-4 flex flex-col items-center">
          <span className="text-xl font-bold text-gray-800">
            {totalRequests.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">Requests</span>
        </div>
      </section>

      {/* Analytics */}
      <section className="bg-white shadow rounded-2xl p-4 flex flex-col items-center">
        <span className="text-xl font-bold text-gray-800">
          {profileViews.toLocaleString()}
        </span>
        <span className="text-sm text-gray-500">Profile Views</span>
      </section>

      {/* Quick Access */}
      <section className="bg-white shadow rounded-2xl p-4 space-y-2">
        <h3 className="text-md font-semibold text-gray-700 mb-2">
          Quick Access
        </h3>
        {quickAccessOptions.map((option) => (
          <button
            key={option.label}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition flex items-center"
            onClick={option.onClick}
            aria-label={option.label}
          >
            {option.label}
          </button>
        ))}
      </section>
    </div>
  );
}
