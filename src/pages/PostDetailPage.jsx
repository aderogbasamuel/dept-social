import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { API_BASE, ENDPOINTS, request } from "../api/client";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import Banner from "../components/Banner";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  const fetchPost = async () => {
    try {
      const data = await request(ENDPOINTS.post(API_BASE, id));
      setPost(data.post || data);
    } catch (err) {
      if (err.message.includes("404")) {
        setNotFound(true);
      } else {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    setPost(null);
    setNotFound(false);
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="min-h-screen bg-emerald-50/40 dark:bg-gray-950 text-gray-800 dark:text-gray-100 transition-colors">
      <div className="max-w-[1200px] mx-auto flex gap-6 p-6">
        <Sidebar />

        <main className="flex-1 min-w-0 flex flex-col gap-3 max-w-2xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1 w-fit"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <Banner text={error} type="error" />

          {notFound && (
            <p className="text-sm text-gray-400 text-center py-8">
              This post doesn't exist or was deleted.
            </p>
          )}

          {!post && !notFound && !error && (
            <p className="text-sm text-gray-400 text-center py-8">
              Loading post...
            </p>
          )}

          {post && (
            <div className="bg-white dark:bg-gray-900 dark:border dark:border-gray-800 rounded-2xl shadow-sm shadow-emerald-900/5 dark:shadow-none overflow-hidden">
              <PostCard
                post={post}
                onChanged={fetchPost}
                onError={setError}
                defaultShowComments
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}