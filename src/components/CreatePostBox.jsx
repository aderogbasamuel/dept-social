import { useState } from "react";
import { Image as ImageIcon, BarChart2, Smile } from "lucide-react";
import { API_BASE, ENDPOINTS, request } from "../api/client";
import Avatar from "./Avatar";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
export default function CreatePostBox({ onPostCreated }) {
  const { user } = useAuth();
  const [text, setText] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) return;
    try {
      const postRequest = request(ENDPOINTS.posts(API_BASE), {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      await toast.promise(postRequest, {
        loading: "Publishing post...",
        success: "Post published",
        error: (err) => err.message,
      });
      setText("");
      onPostCreated?.();
    } catch {
      return;
    }
  };

  return (
    <div id="create-post" className="p-4 border-b border-gray-100 px-3 -mt-1">
      <div className="flex items-center gap-3 mb-3">
        <Avatar name={user?.username} avatarUrl={user?.avatarUrl} size={10} />
        <input
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="flex-1 bg-emerald-900/5 rounded-full px-4 py-2.5 text-sm outline-none placeholder:text-gray-600"
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
          className="ml-auto bg-emerald-600 text-white text-sm font-medium rounded-full px-6 py-1.5"
        >
          Post
        </button>
      </div>
    </div>
  );
}
