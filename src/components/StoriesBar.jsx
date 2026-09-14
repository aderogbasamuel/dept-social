import { useState, useEffect } from "react";
import { Plus, X, Heart, Trash2, ChevronRight } from "lucide-react";
import { API_BASE, ENDPOINTS, request } from "../api/client";
import Avatar from "./Avatar";
import { useAuth } from "../context/AuthContext";

export default function StoriesBar({ onError }) {
  const { user } = useAuth();
  const [statuses, setStatuses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newText, setNewText] = useState("");
  const [liked, setLiked] = useState({});

  const fetchStatuses = async () => {
    try {
      const data = await request(ENDPOINTS.statuses(API_BASE));
      setStatuses(data.statuses || data || []);
    } catch (err) {
      onError?.(err.message);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  // One avatar per author, showing their most recent status
  const byAuthor = statuses.reduce((acc, s) => {
    const authorId = s.author?._id || s.author;
    if (!acc[authorId] || new Date(s.createdAt) > new Date(acc[authorId].createdAt)) {
      acc[authorId] = s;
    }
    return acc;
  }, {});
  const storyTiles = Object.values(byAuthor);

  const handleCreate = async () => {
    if (!newText.trim()) return;
    try {
      await request(ENDPOINTS.statuses(API_BASE), {
        method: "POST",
        body: JSON.stringify({ text: newText }),
      });
      setNewText("");
      setShowCreate(false);
      fetchStatuses();
    } catch (err) {
      onError?.(err.message);
    }
  };

  const handleLike = async (id) => {
    try {
      await request(ENDPOINTS.likeStatus(API_BASE, id), { method: "POST" });
      setLiked((l) => ({ ...l, [id]: !l[id] }));
      fetchStatuses();
    } catch (err) {
      onError?.(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await request(ENDPOINTS.status(API_BASE, id), { method: "DELETE" });
      setSelected(null);
      fetchStatuses();
    } catch (err) {
      onError?.(err.message);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-4 shadow-sm shadow-emerald-900/5 flex items-center gap-4 overflow-x-auto">
        <button
          onClick={() => setShowCreate(true)}
          className="flex flex-col items-center gap-1.5 shrink-0"
        >
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-emerald-300 flex items-center justify-center">
            <Plus size={18} className="text-emerald-500" />
          </div>
          <span className="text-xs text-gray-500">Your story</span>
        </button>

        {storyTiles.map((s) => (
          <button
            key={s._id || s.id}
            onClick={() => setSelected(s)}
            className="flex flex-col items-center gap-1.5 shrink-0"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 p-[2px]">
              <div className="w-full h-full rounded-full bg-white p-[2px]">
                <Avatar name={s.author?.username} size={12} />
              </div>
            </div>
            <span className="text-xs text-gray-500 max-w-[56px] truncate">
              {s.author?.username || "Unknown"}
            </span>
          </button>
        ))}

        {storyTiles.length === 0 && (
          <p className="text-xs text-gray-400">No status updates yet.</p>
        )}

        <button className="ml-auto shrink-0 text-emerald-500">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Create status modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-sm text-gray-800">
                New status
              </p>
              <button onClick={() => setShowCreate(false)}>
                <X size={18} className="text-gray-400" />
              </button>
            </div>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 resize-none"
              rows={3}
              placeholder="What's your status?"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              autoFocus
            />
            <button
              onClick={handleCreate}
              className="w-full bg-emerald-600 text-white text-sm rounded-lg py-2 font-medium"
            >
              Post status
            </button>
          </div>
        </div>
      )}

      {/* View status modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 w-full max-w-sm text-white relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-white/80"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Avatar name={selected.author?.username} size={8} />
              <div>
                <p className="text-sm font-medium">
                  {selected.author?.username || "Unknown"}
                </p>
                <p className="text-xs text-white/70">
                  {new Date(selected.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <p className="text-lg leading-relaxed mb-6 min-h-[80px]">
              {selected.text}
            </p>

            <div className="flex items-center justify-between">
              <button
                onClick={() => handleLike(selected._id || selected.id)}
                className="flex items-center gap-1.5 text-sm"
              >
                <Heart
                  size={18}
                  fill={liked[selected._id || selected.id] ? "currentColor" : "none"}
                />
                {(selected.likes?.length ?? 0) +
                  (liked[selected._id || selected.id] ? 1 : 0)}
              </button>

              {(selected.author?.username === user?.username) && (
                <button
                  onClick={() => handleDelete(selected._id || selected.id)}
                  className="flex items-center gap-1.5 text-sm text-white/80"
                >
                  <Trash2 size={16} /> Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}