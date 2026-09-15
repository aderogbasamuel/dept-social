import { useState } from "react";
import { Image as ImageIcon, BarChart2, Smile, X } from "lucide-react";
import { API_BASE } from "../api/client";
import Avatar from "./Avatar";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
async function uploadRequest(url, formData) {

  
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  let data = null;
  try {
    data = await res.json();
  } catch (_) {}
  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }
  return data;
}

export default function CreatePostBox({ onPostCreated, onError }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [posting, setPosting] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const clearImage = () => {
    setFile(null);
    setPreviewUrl("");
  };

  const handleSubmit = async () => {
    if (!text.trim() && !file) return;
    setPosting(true);
    try {
      const formData = new FormData();
      formData.append("text", text);
      if (file) formData.append("image", file);

      const postRequest = uploadRequest(`${API_BASE}/posts`, formData);
      await toast.promise(postRequest, {
        loading: "Publishing post...",
        success: "Post published",
        error: (err) => err.message,
      });
      setText("");
      clearImage();
      onPostCreated?.();
    } catch (err) {
      onError?.(err.message);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="p-4 border border-gray-100/80 px-3 mx-2 bg-white rounded-2xl shadow-sm shadow-emerald-900/5 mt-2 dark:bg-gray-900 dark:border-gray-800 dark:shadow-none">
      <div className="flex items-center gap-3 mb-3">
        <Avatar name={user?.username} avatarUrl={user?.avatarUrl} size={10} />
        <input
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 bg-emerald-600/10 rounded-full px-4 py-2.5 text-sm outline-none placeholder:text-gray-600 dark:bg-gray-800 dark:placeholder:text-gray-500"
        />
      </div>

      {previewUrl && (
        <div className="relative mb-3 inline-block">
          <img
            src={previewUrl}
            alt="preview"
            className="max-h-48 rounded-lg object-cover"
          />
          <button
            onClick={clearImage}
            className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full p-1"
          >
            <X size={12} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-5 pl-1 text-sm text-gray-500">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <ImageIcon size={16} className="text-emerald-500" /> Photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        <button className="flex items-center gap-1.5">
          <BarChart2 size={16} className="text-emerald-500" /> Poll
        </button>
        <button className="flex items-center gap-1.5">
          <Smile size={16} className="text-emerald-500" /> Feeling
        </button>
        <button
          onClick={handleSubmit}
          disabled={posting}
          className="ml-auto bg-emerald-600 text-white text-xs font-medium rounded-full px-4 py-1.5 disabled:opacity-50"
        >
          {posting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
