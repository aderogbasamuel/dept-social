import { useState, useEffect } from "react";
import { API_BASE, ENDPOINTS, request } from "../api/client";
import { toast } from "sonner";
import Avatar from "./Avatar";
import { MoreHorizontal } from "lucide-react";
import CommentCard from "./CommentCard";
function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateString).toLocaleDateString();
}
export default function CommentSection({ postId, onError,  }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  
  const fetchComments = async () => {
    try {
      const data = await request(ENDPOINTS.commentsForPost(API_BASE, postId));
      setComments(data.comments || data || []);
    } catch (err) {
      onError?.(err.message);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await request(ENDPOINTS.comments(API_BASE), {
        method: "POST",
        body: JSON.stringify({ postId, content: newComment }),
      });
      setNewComment("");
      toast.success("Comment added");
      fetchComments();
    } catch (err) {
      onError?.(err.message);
    }
  };

  return (
    <>
      <div className="mt-3 border-t-2 border-gray-100 dark:border-gray-600 pt-3 space-y-2">
        {comments.length === 0 && (
          <p className="text-xs text-gray-400">No comments yet.</p>
        )}
        {comments.map((c) => (
          <CommentCard key={c._id || c.id} c={c} onError={onError} onChanged={fetchComments} />
        ))}

        <div className="flex gap-2 pt-1">
          <input
            className="flex-1 border border-gray-300 rounded-full p-2 text-xs dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <button
            onClick={handleSubmit}
            className="text-xs bg-emerald-600 text-white rounded-full px-3"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
