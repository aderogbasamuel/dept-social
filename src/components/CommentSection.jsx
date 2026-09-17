import { useState, useEffect } from "react";
import { API_BASE, ENDPOINTS, request } from "../api/client";
import { toast } from "sonner";
import Avatar from "./Avatar";
import { MoreHorizontal } from "lucide-react";

export default function CommentSection({ postId, onError }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const handleDelete = async () => {
    setMenuOpen(false);
    try {
      await request(ENDPOINTS.post(API_BASE, id), { method: "DELETE" });
      onChanged?.();
    } catch (err) {
      onError?.(err.message);
    }
  };
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
      <div className="mt-3 border-t border-gray-100 pt-3 space-y-2">
        {comments.length === 0 && (
          <p className="text-xs text-gray-400">No comments yet.</p>
        )}
        {comments.map((c) => (
          <div>
            {" "}
            <button
              onClick={() => navigate(`/users/${c.author?._id}`)}
              className="h-fit shrink-0"
            >
              <Avatar
                name={c.author?.username}
                avatarUrl={c.author?.avatarUrl}
                size={10}
              />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-sm">
                <button
                  onClick={() => navigate(`/users/${c.author?._id}`)}
                  className="font-semibold text-gray-900 truncate dark:text-gray-100"
                >
                  {c.author?.username || "Unknown"}
                </button>
                <span className="text-gray-400 dark:text-gray-300">·</span>
                <button
                  onClick={() => navigate(`/posts/${id}`)}
                  className="text-gray-400 hover:underline"
                >
                  {timeAgo(c.createdAt)}
                </button>

                <div className="relative ml-auto">
                  <button
                    onClick={() => setMenuOpen((m) => !m)}
                    className="text-gray-400 hover:text-gray-600 p-1 -mr-1 rounded-full hover:bg-gray-100"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 top-7 z-10 bg-white border border-gray-200 rounded-lg shadow-md text-xs overflow-hidden w-28">
                      <button
                        onClick={handleDelete}
                        className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex gap-2 pt-1">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-xs"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <button
            onClick={handleSubmit}
            className="text-xs bg-emerald-600 text-white rounded-lg px-3"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
