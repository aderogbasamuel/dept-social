import { useState } from "react";
import { Image as ImageIcon, BarChart2, Smile } from "lucide-react";
import { API_BASE, ENDPOINTS, request } from "../api/client";
import Avatar from "./Avatar";
import { useAuth } from "../context/AuthContext";
export default function CreatePostBox({ onPostCreated, onError }) {
  const { user } = useAuth();
  const [text, setText] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) return;
    try {
      await request(ENDPOINTS.posts(API_BASE), {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      setText("");
      onPostCreated?.();
    } catch (err) {
      onError?.(err.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm shadow-emerald-900/5">
      <div className="flex items-center gap-3 mb-3">
        <Avatar name={user?.username} size={10} />
        <input
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="flex-1 bg-emerald-50/60 rounded-full px-4 py-2.5 text-sm outline-none placeholder:text-gray-400"
        />
      </div>
      <div className="flex items-center gap-5 pl-1 text-sm text-gray-500">
        <button className="flex items-center gap-1.5">
          <ImageIcon size={16} className="text-emerald-500" /> Photo
        </button>
        <button className="flex items-center gap-1.5">
          <BarChart2 size={16} className="text-emerald-500" /> Poll
        </button>
        <button className="flex items-center gap-1.5">
          <Smile size={16} className="text-emerald-500" /> Feeling
        </button>
        <button
          onClick={handleSubmit}
          className="ml-auto bg-emerald-600 text-white text-xs font-medium rounded-full px-4 py-1.5"
        >
          Post
        </button>
      </div>
    </div>
  );
}
