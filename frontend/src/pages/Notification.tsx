import Navbar from "../components/Navbar";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";

export default function Notifications() {
  // Dummy notifications
  const notifications = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    type: i % 3 === 0 ? "like" : i % 3 === 1 ? "comment" : "follow",
    text:
      i % 3 === 0
        ? `User ${i + 1} liked your post`
        : i % 3 === 1
        ? `User ${i + 1} commented on your post`
        : `User ${i + 1} started following you`,
    avatar: `https://i.pravatar.cc/50?img=${i + 30}`,
    timestamp: `${Math.floor(Math.random() * 12) + 1}h ago`,
  }));

  return (
    <div className="min-h-screen bg-gray-100 overflow-hidden">
      <Navbar />

      <div className="ml-68 mx-auto py-6 ">
        <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-5 gap-6">
          {/* Left Sidebar */}
          <LeftSidebar posts={[]} />

          {/* Center Notifications Section */}
          <div className="col-span-2 bg-white p-6 rounded-2xl shadow-md flex flex-col">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              Notifications
            </h2>

            <div className="space-y-4 overflow-y-auto max-h-[75vh] pr-2">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl shadow-sm hover:bg-gray-100 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={notif.avatar}
                      alt="avatar"
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="text-gray-700 text-sm">{notif.text}</p>
                    </div>
                  </div>
                  <span className="text-gray-400 text-xs">
                    {notif.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <RightSidebar onCreatePost={() => {}} />
        </div>
      </div>
    </div>
  );
}
