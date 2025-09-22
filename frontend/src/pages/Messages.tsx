import Navbar from "../components/Navbar";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";

export default function Messages() {
  // Dummy conversations
  const conversations = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    name: `User ${i + 1}`,
    avatar: `https://i.pravatar.cc/50?img=${i + 20}`,
    lastMessage: `This is a preview of the last message from User ${i + 1}.`,
    timestamp: `${Math.floor(Math.random() * 12) + 1}h ago`,
  }));

  return (
    <div className="min-h-screen bg-gray-100 overflow-hidden">
      <Navbar />

      <div className="ml-68 mx-auto py-6 ">
        <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-5 gap-6">
          {/* Left Sidebar */}
          <LeftSidebar />

          {/* Center Messages Section */}
          <div className="col-span-2 bg-white p-6 rounded-2xl shadow-md flex flex-col">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Messages</h2>

            <div className="space-y-4 overflow-y-auto max-h-[75vh] pr-2">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl shadow-sm hover:bg-gray-100 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{conv.name}</p>
                      <p className="text-gray-500 text-sm truncate w-52">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                  <span className="text-gray-400 text-xs">
                    {conv.timestamp}
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
