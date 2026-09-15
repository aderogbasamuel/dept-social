import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE, ENDPOINTS, request } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";
import Header from "../components/Header";
import CreatePostBox from "../components/CreatePostBox";
import PostCard from "../components/PostCard";
import StoriesBar from "../components/StoriesBar";
import MobileBottomNav from "../components/MobileBottomNav";
export default function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const data = await request(ENDPOINTS.posts(API_BASE));
      setPosts(data.posts || data || []);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white pb-20 text-gray-800 lg:pb-0 dark:bg-gray-950">
      <div className="max-w-[1200px] mx-auto flex gap-6 sm:p-6">
        <Sidebar />

        <main className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-center justify-between">
            <Header />
          </div>
          <button
            onClick={handleLogout}
            className="self-end text-xs text-red-400 px-6 mt-2"
          >
            Log out
          </button>

          <CreatePostBox onPostCreated={fetchPosts} />
          <StoriesBar onError={toast.error} />

          {posts.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">
              No posts yet — be the first to share something.
            </p>
          )}

          {posts.map((post) => (
            <PostCard
              key={post._id || post.id}
              post={post}
              onChanged={fetchPosts}
              onError={toast.error}
            />
          ))}
        </main>

        <RightSidebar />
      </div>
      <MobileBottomNav />
    </div>
  );
}
