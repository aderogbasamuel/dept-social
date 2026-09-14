import { useState, useEffect } from "react";
import { API_BASE, ENDPOINTS, request } from "../api/client";

export default function CommentSection({ postId, onError }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

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
      fetchComments();
    } catch (err) {
      onError?.(err.message);
    }
  };

  return (
    <div className="mt-3 border-t border-gray-100 pt-3 space-y-2">
      {comments.length === 0 && (
        <p className="text-xs text-gray-400">No comments yet.</p>
      )}
      {comments.map((c) => (
        <div key={c._id || c.id} className="text-xs">
          <span className="font-medium text-gray-700">
            {c.author?.username || "Unknown"}:
          </span>{" "}
          <span className="text-gray-600">{c.content}</span>
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
  );
}
