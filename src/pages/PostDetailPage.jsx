import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { API_BASE, ENDPOINTS, request } from "../api/client";
import Sidebar from "../components/Sidebar";
import { toast } from "sonner";
import PostCard from "../components/PostCard";
import Banner from "../components/Banner";
import AppLayout from "../components/AppLayout";

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
    <AppLayout>
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
              <CommentSection postId={id} onError={toast.error} />
            </div>
          )}
       </AppLayout>
  );
}