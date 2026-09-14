import { useState } from "react";
import { Camera } from "lucide-react";
import { API_BASE, request } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";
import Banner from "./Banner";
import imageCompression from "browser-image-compression";
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
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
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
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  }
};


  const handleSaveUsername = async () => {
    setError("");
    setNotice("");
    if (!username.trim()) {
      setError("Username cannot be empty");
      return;
    }
    setSaving(true);
    try {
      const data = await request(`${API_BASE}/users/username`, {
        method: "PATCH",
        body: JSON.stringify({ username }),
      });
      updateUser?.(data.user);
      setNotice("Username updated");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUploadAvatar = async () => {
    if (!file) return;
    setError("");
    setNotice("");
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const data = await uploadRequest(`${API_BASE}/users/avatar`, formData);
      updateUser?.(data.user);
      setNotice("Avatar updated");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm shadow-emerald-900/5 max-w-sm">
      <h2 className="text-sm font-semibold text-gray-800 mb-4">
        Profile settings
      </h2>

      <Banner text={error} type="error" />
      <Banner text={notice} />

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