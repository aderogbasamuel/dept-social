import { useState } from "react";
import { Camera } from "lucide-react";
import { API_BASE, request } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
// Separate from the shared `request()` helper since file uploads need
// multipart/form-data, not JSON — the browser sets its own boundary header,
// so we must NOT set Content-Type manually here.
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

export default function ProfileSettings() {
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatarUrl || "");
  const [saving, setSaving] = useState(false);


const handleFileChange = async (e) => {
  const selected = e.target.files?.[0];
  if (!selected) return;

  try {
    const compressed = await imageCompression(selected, {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    });
    setFile(compressed);
    setPreviewUrl(URL.createObjectURL(compressed));
  } catch (err) {
    console.error("Compression failed, using original file:", err);
    toast.info("Could not optimize the image; the original will be uploaded.");
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  }
};


  const handleSaveUsername = async () => {
    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    setSaving(true);
    try {
      const usernameRequest = request(`${API_BASE}/users/username`, {
        method: "PATCH",
        body: JSON.stringify({ username }),
      });
      const data = await toast.promise(usernameRequest, {
        loading: "Saving username...",
        success: "Username updated",
        error: (err) => err.message,
      });
      updateUser?.(data.user);
    } catch {
      return;
    } finally {
      setSaving(false);
    }
  };

  const handleUploadAvatar = async () => {
    if (!file) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const avatarRequest = uploadRequest(`${API_BASE}/users/avatar`, formData);
      const data = await toast.promise(avatarRequest, {
        loading: "Uploading avatar...",
        success: "Avatar updated",
        error: (err) => err.message,
      });
      updateUser?.(data.user);
    } catch {
      return;
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm shadow-emerald-900/5 dark:shadow-none dark:border dark:border-gray-800">
      <h2 className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-4">
        Profile settings
      </h2>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-5">
        <div className="relative">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="avatar preview"
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <Avatar name={username} size={16} avatarUrl={user?.avatarUrl} />
          )}
          <label className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-1.5 cursor-pointer">
            <Camera size={12} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
        {file && (
          <button
            onClick={handleUploadAvatar}
            disabled={saving}
            className="text-xs bg-emerald-600 text-white rounded-lg px-3 py-1.5 disabled:opacity-50"
          >
            {saving ? "Uploading..." : "Save photo"}
          </button>
        )}
      </div>

      {/* Username */}
      <label className="block text-xs font-medium text-gray-500 mb-1">
        Username
      </label>
      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          onClick={handleSaveUsername}
          disabled={saving}
          className="bg-emerald-600 text-white text-sm rounded-lg px-4 disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  );
}