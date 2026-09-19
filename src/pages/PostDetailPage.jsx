import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { API_BASE, ENDPOINTS, request } from "../api/client";
import { toast } from "sonner";
import PostCard from "../components/PostDetailPageCard";
import Banner from "../components/Banner";
import AppLayout from "../components/AppLayout";
import CommentSection from "../components/CommentSection";
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
      console.log(data);
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
  }, [id]);

  return (
    <AppLayout>
      <Banner text={error} type="error" />
      <div className="-mt-5">
        {notFound && (
          <p className="text-sm text-gray-400 text-center py-6">
            This post doesn't exist or was deleted.
          </p>
        )}

        {!post && !notFound && !error && (
          <p className="text-sm text-gray-400 text-center py-6">
            Loading post...
          </p>
        )}

        {post && (
          <div className=" overflow-hidden">
            <PostCard
              key={id}
              post={post}
              onChanged={fetchPost}
              onError={setError}
              defaultShowComments
            />
            <CommentSection postId={id} onError={toast.error} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
