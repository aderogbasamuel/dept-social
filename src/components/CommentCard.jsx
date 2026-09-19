import { useState, useEffect } from "react";
import { API_BASE, ENDPOINTS, request } from "../api/client";
import Avatar from "./Avatar";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
export default function CommentCard({ c, onError }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const handleDelete = async () => {
    setMenuOpen(false);
    try {
      await request(ENDPOINTS.post(API_BASE, id), { method: "DELETE" });
      onChanged?.();
    } catch (err) {
      onError?.(err.message);
    }
  };

  return (
    <div className="flex gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50/60 dark:hover:bg-gray-600/10 transition-colors shadow-sm shadow-emerald-900/5 dark:shadow-none dark:border-b pt-4 dark:border-gray-800">
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
              <div className="absolute right-0 top-7 z-10 bg-white border border-gray-200 dark:border-gray-400 dark:bg-gray-800 rounded-lg shadow-md text-xs overflow-hidden w-28">
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
        {c.content && (
          <p className="text-sm text-gray-800 dark:text-gray-400 -mt-0.5 mb-2 leading-normal whitespace-pre-wrap">
            {c.content}
          </p>
        )}
      </div>
    </div>
  );
}
