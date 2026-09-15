import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  MoreHorizontal,
} from "lucide-react";
import { API_BASE, ENDPOINTS, request } from "../api/client";
import Avatar from "./Avatar";
import CommentSection from "./CommentSection";

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

export default function PostCard({ post, onChanged, onError }) {
  const id = post._id || post.id;
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.text);
  const [menuOpen, setMenuOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    try {
      await request(ENDPOINTS.likePost(API_BASE, id), { method: "POST" });
      setLiked((l) => !l);
      onChanged?.();
    } catch (err) {
      onError?.(err.message);
    }
  };

  const handleDelete = async () => {
    setMenuOpen(false);
    try {
      await request(ENDPOINTS.post(API_BASE, id), { method: "DELETE" });
      onChanged?.();
    } catch (err) {
      onError?.(err.message);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await request(ENDPOINTS.post(API_BASE, id), {
        method: "PUT",
        body: JSON.stringify({ text: editText }),
      });
      setIsEditing(false);
      onChanged?.();
    } catch (err) {
      onError?.(err.message);
    }
  };

  return (
    <article className="flex gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50/60 transition-colors">
      <Avatar name={post.author?.username} size={10} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-sm">
          <span className="font-semibold text-gray-900 truncate">
            {post.author?.username || "Unknown"}
          </span>
          <span className="text-gray-400">·</span>
          <span className="text-gray-400">{timeAgo(post.createdAt)}</span>

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
                  onClick={() => {
                    setIsEditing(true);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-700"
                >
                  Edit
                </button>
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

        {isEditing ? (
          <div className="flex gap-2 mt-1 mb-2">
            <input
              className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-sm"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              autoFocus
            />
            <button
              onClick={handleSaveEdit}
              className="text-xs bg-emerald-600 text-white rounded-lg px-3"
            >
              Save
            </button>
          </div>
        ) : (
          <>
            {post.text && (
              <p className="text-sm text-gray-800 mt-0.5 mb-2 leading-normal whitespace-pre-wrap">
                {post.text}
              </p>
            )}
            {post.image && (
              <img
                src={post.image}
                alt="post attachment"
                className="rounded-xl max-h-96 w-full object-cover mb-2 border border-gray-100"
                loading="lazy"
              />
            )}
          </>
        )}

        <div className="flex items-center justify-between max-w-xs text-gray-500 -ml-2">
          <button
            onClick={() => setShowComments((s) => !s)}
            className="flex items-center gap-1.5 group p-2 rounded-full hover:bg-blue-50"
          >
            <MessageCircle
              size={16}
              className="group-hover:text-blue-500 transition-colors"
            />
            <span className="text-xs group-hover:text-blue-500 transition-colors">
              {post.commentCount ?? 0}
            </span>
          </button>

          <button className="flex items-center gap-1.5 group p-2 rounded-full hover:bg-emerald-50">
            <Repeat2
              size={16}
              className="group-hover:text-emerald-600 transition-colors"
            />
            <span className="text-xs group-hover:text-emerald-600 transition-colors">
              0
            </span>
          </button>

          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 group p-2 rounded-full hover:bg-pink-50"
          >
            <Heart
              size={16}
              fill={liked ? "currentColor" : "none"}
              className={`transition-colors ${
                liked
                  ? "text-pink-600"
                  : "text-gray-500 group-hover:text-pink-600"
              }`}
            />
            <span
              className={`text-xs transition-colors ${
                liked ? "text-pink-600" : "group-hover:text-pink-600"
              }`}
            >
              {(post.likes?.length ?? 0) + (liked ? 1 : 0)}
            </span>
          </button>

          <button className="p-2 rounded-full hover:bg-gray-100 group">
            <Share
              size={16}
              className="group-hover:text-gray-700 transition-colors"
            />
          </button>
        </div>

        {showComments && (
          <div className="mt-1">
            <CommentSection postId={id} onError={onError} />
          </div>
        )}
      </div>
    </article>
  );
}