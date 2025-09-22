import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../config/redux/store";
import { getAboutUser } from "../config/redux/action/authAction";

interface UserProfile {
  userId: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  bio?: string;
  currentPost?: string;
  pastWork: any[];
  education: any[];
  profileViews: number;
}

interface LeftSidebarProps {
  posts: any[];
}

export default function LeftSidebar({}: LeftSidebarProps) {
  const authState = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [totalConnections, setTotalConnections] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await dispatch(getAboutUser({ token })).unwrap();

        const fetchedProfile: UserProfile = {
          userId: {
            _id: response.profile.userId._id,
            name: response.profile.userId.name,
            email: response.profile.userId.email,
            profilePicture: response.profile.userId.profilePicture,
          },
          bio: response.profile.bio,
          currentPost: response.profile.currentPost,
          pastWork: response.profile.pastWork || [],
          education: response.profile.education || [],
          profileViews: response.profile.profileViews || 0,
        };

        setProfile(fetchedProfile);
        setTotalConnections(response.user.connections?.length || 0);
        setTotalRequests(response.user.connectionRequest?.length || 0);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    fetchData();
  }, [authState.loggedIn, dispatch]);

  const handleProfileClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="sm:col-span-1 md:col-span-1 bg-white shadow rounded-2xl p-4 space-y-6">
      <div className="flex flex-col items-center text-center">
        <img
          src={
            profile?.userId.profilePicture
              ? `/uploads/${profile.userId.profilePicture}`
              : "https://via.placeholder.com/100"
          }
          alt="avatar"
          className="w-20 h-20 rounded-full shadow-md"
        />
        <h2
          className="mt-3 text-lg font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
          onClick={() => handleProfileClick(profile?.userId._id || "")}
        >
          {profile?.userId.name || "Loading..."}
        </h2>
        <p className="text-sm text-gray-500">{profile?.userId.email}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 p-3 rounded-lg text-center shadow-sm">
          <p className="text-lg font-bold text-blue-600">{totalConnections}</p>
          <p className="text-sm text-gray-600">Connections</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg text-center shadow-sm">
          <p className="text-lg font-bold text-green-600">{totalRequests}</p>
          <p className="text-sm text-gray-600">Requests</p>
        </div>
      </div>

      <div className="bg-yellow-50 p-3 rounded-lg shadow-sm text-center">
        <p className="text-sm text-gray-600">Profile Views</p>
        <p className="text-lg font-bold text-yellow-700">
          {profile?.profileViews || 0}
        </p>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg shadow-sm space-y-2">
        {["Saved Items", "Groups", "Newsletter", "Events"].map((item) => (
          <button
            key={item}
            className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 transition-colors cursor-pointer text-gray-700 font-medium"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
