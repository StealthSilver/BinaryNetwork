import Navbar from "../components/Navbar";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";

export default function Network() {
  const connections = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    name: `Connection ${i + 1}`,
    avatar: `https://i.pravatar.cc/50?img=${i + 10}`,
    title: `Professional Title ${i + 1}`,
  }));

  return (
    <div className="min-h-screen bg-gray-100 overflow-hidden">
      <Navbar />

      <div className="ml-68 mx-auto py-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-5 gap-6">
          <LeftSidebar posts={[]} />

          <div className="col-span-2 bg-white p-6 rounded-2xl shadow-md flex flex-col">
            <h2 className="text-xl font-bold mb-6 text-gray-800">My Network</h2>

            <div className="space-y-4 overflow-y-auto max-h-[75vh] pr-2">
              {connections.map((conn) => (
                <div
                  key={conn.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={conn.avatar}
                      alt={conn.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{conn.name}</p>
                      <p className="text-gray-500 text-sm">{conn.title}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>

          <RightSidebar onCreatePost={() => {}} />
        </div>
      </div>
    </div>
  );
}
