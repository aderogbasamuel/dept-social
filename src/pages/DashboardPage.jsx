import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE, ENDPOINTS, request } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";
import Header from "../components/Header";
import CreatePostBox from "../components/CreatePostBox";
import PostCard from "../components/PostCard";
import Banner from "../components/Banner";
import StoriesBar from "../components/StoriesBar";
export default function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    try {
      const data = await request(ENDPOINTS.posts(API_BASE));
      setPosts(data.posts || data || []);
    } catch (err) {
      setError(err.message);
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
    <div className="min-h-screen bg-emerald-50/40 text-gray-800">
      <div className="max-w-[1200px] mx-auto flex gap-6 p-6">
        <Sidebar />

        <main className="flex-1 min-w-0 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <Header />
          </div>
          <button
            onClick={handleLogout}
            className="self-end text-xs text-gray-400 -mt-3"
          >
            Log out
          </button>

          <Banner text={error} type="error" />
          <StoriesBar onError={setError} />
          <CreatePostBox onPostCreated={fetchPosts} onError={setError} />

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
              onError={setError}
            />
          ))}
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}
