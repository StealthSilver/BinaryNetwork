import Navbar from "../components/Navbar";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import CreatePost from "../components/CreatePost";
import { Heart, MessageCircle, Repeat, Share2 } from "lucide-react";
import { createPost, type Post } from "../config/redux/action/postAction";
import type { AsyncThunkAction, AsyncThunkConfig } from "@reduxjs/toolkit";

export default function Dashboard() {
  const dummyPosts = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    name: `User ${i + 1}`,
    avatar: `https://i.pravatar.cc/50?img=${i + 1}`,
    description: `This is a sample description for post number ${i + 1}.`,
    image: `https://picsum.photos/600/400?random=${i + 1}`,
  }));

  const handleCreatePost = async (
    description: string,
    image: File | null
  ): Promise<void> => {
    const formData = new FormData();
    formData.append("body", description);
    if (image) formData.append("media", image);

    await dispatch(createPost(formData));
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="flex justify-center ml-80 mx-auto  py-6 overflow-y-hidden max-h-[93vh]">
        <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-5 gap-4">
          <LeftSidebar posts={[]} />

          <div className="col-span-2 bg-white p-4 rounded-2xl shadow-md flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Feed</h2>
            <CreatePost onPost={handleCreatePost} />

            <div className="flex-1 overflow-y-auto space-y-6 max-h-[80vh] pr-2">
              {dummyPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-50 rounded-2xl shadow-sm p-4 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.avatar}
                        alt={post.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <p className="font-semibold text-gray-800">{post.name}</p>
                    </div>
                    <button className="text-blue-600 font-semibold px-3 py-1 border border-blue-600 rounded-full hover:bg-blue-50 transition">
                      Follow
                    </button>
                  </div>

                  <p className="text-gray-700 mb-3">{post.description}</p>

                  <img
                    src={post.image}
                    alt="post media"
                    className="w-full rounded-2xl object-cover max-h-96 mb-3"
                  />

                  <div className="flex justify-between text-gray-600">
                    <button className="flex items-center gap-1 hover:text-red-600 transition">
                      <Heart className="w-5 h-5" /> Like
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-600 transition">
                      <MessageCircle className="w-5 h-5" /> Comment
                    </button>
                    <button className="flex items-center gap-1 hover:text-green-600 transition">
                      <Repeat className="w-5 h-5" /> Repost
                    </button>
                    <button className="flex items-center gap-1 hover:text-purple-600 transition">
                      <Share2 className="w-5 h-5" /> Share
                    </button>
                  </div>
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
function dispatch(_arg0: AsyncThunkAction<Post, FormData, AsyncThunkConfig>) {
  throw new Error("Function not implemented.");
}
