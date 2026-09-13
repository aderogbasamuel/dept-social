import { useState, useEffect } from "react";

// ---------------------------------------------------------------------------
// EDIT THESE IF YOUR ROUTES ARE SHAPED DIFFERENTLY
// ---------------------------------------------------------------------------
const ENDPOINTS = {
  register: (base) => `${base}/auth/signup`,
  verify: (base) => `${base}/auth/verify-email`,
  login: (base) => `${base}/auth/login`,
  logout: (base) => `${base}/auth/logout`,

  posts: (base) => `${base}/posts`,
  post: (base, id) => `${base}/posts/${id}`,
  likePost: (base, id) => `${base}/posts/${id}/like`,

  comments: (base) => `${base}/comments`,
  commentsForPost: (base, postId) => `${base}/comments/${postId}`,
};

async function request(url, options = {}) {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  let data = null;
  try {
    data = await res.json();
  } catch (_) {
    // no body
  }
  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }
  return data;
}

function Banner({ text, type }) {
  if (!text) return null;
  const styles =
    type === "error"
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-green-50 text-green-700 border-green-200";
  return (
    <div className={`text-sm border rounded-md px-3 py-2 mb-4 ${styles}`}>
      {text}
    </div>
  );
}

export default function ApiTester() {
  const [apiBase, setApiBase] = useState("http://localhost:5000/api");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [authMode, setAuthMode] = useState("login"); // login | register | verify
  const [regUserId, setRegUserId] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    code: "",
  });

  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const [selectedPostId, setSelectedPostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const clearMessages = () => {
    setError("");
    setNotice("");
  };

  const handleField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  // ---- Auth ----
  const handleRegister = async () => {
    clearMessages();
    try {
      const data = await request(ENDPOINTS.register(apiBase), {
        method: "POST",
        body: JSON.stringify({
          username: form.name,
          email: form.email,
          password: form.password,
          department: form.department,
        }),
      });
      setRegUserId(data?.userId || "");
      setNotice(data?.message || "Registered. Check for a verification code.");
      setAuthMode("verify");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerify = async () => {
    clearMessages();
    try {
      const data = await request(ENDPOINTS.verify(apiBase), {
        method: "POST",
        body: JSON.stringify({ userId: regUserId, code: form.code }),
      });
      setNotice(data?.message || "Verified. You can log in now.");
      setAuthMode("login");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async () => {
    clearMessages();
    try {
      const data = await request(ENDPOINTS.login(apiBase), {
        method: "POST",
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      setUser(data.user || { name: form.email });
      setNotice("Logged in.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    clearMessages();
    try {
      await request(ENDPOINTS.logout(apiBase), { method: "POST" });
    } catch (_) {
      // ignore — clear local state regardless
    }
    setUser(null);
    setPosts([]);
    setComments([]);
    setSelectedPostId(null);
  };

  // ---- Posts ----
  const fetchPosts = async () => {
    clearMessages();
    try {
      const data = await request(ENDPOINTS.posts(apiBase));
      setPosts(data.posts || data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const createPost = async () => {
    if (!newPostText.trim()) return;
    clearMessages();
    try {
      await request(ENDPOINTS.posts(apiBase), {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ text: newPostText }),
      });
      setNewPostText("");
      fetchPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (post) => {
    setEditingPostId(post._id || post.id);
    setEditingText(post.text);
  };

  const saveEdit = async (id) => {
    clearMessages();
    try {
      await request(ENDPOINTS.post(apiBase, id), {
        method: "PUT",
        body: JSON.stringify({ text: editingText }),
      });
      setEditingPostId(null);
      setEditingText("");
      fetchPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  const deletePost = async (id) => {
    clearMessages();
    try {
      await request(ENDPOINTS.post(apiBase, id), { method: "DELETE" });
      if (selectedPostId === id) setSelectedPostId(null);
      fetchPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  const likePost = async (id) => {
    clearMessages();
    try {
      await request(ENDPOINTS.likePost(apiBase, id), { method: "POST" });
      fetchPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  // ---- Comments ----
  const openComments = async (postId) => {
    setSelectedPostId(postId);
    clearMessages();
    try {
      const data = await request(ENDPOINTS.commentsForPost(apiBase, postId));
      setComments(data.comments || data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const createComment = async () => {
    if (!newComment.trim() || !selectedPostId) return;
    clearMessages();
    try {
      await request(ENDPOINTS.comments(apiBase), {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ postId: selectedPostId, content: newComment }),
      });
      setNewComment("");
      openComments(selectedPostId);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (user) fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">
          API Tester
        </h1>
        <p className="text-sm text-gray-500 mb-4">
          Quick manual test client for auth / posts / comments.
        </p>

        <div className="mb-6">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            API base URL
          </label>
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={apiBase}
            onChange={(e) => setApiBase(e.target.value)}
          />
        </div>

        <Banner text={error} type="error" />
        <Banner text={notice} type="notice" />

        {!user ? (
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex gap-2 mb-4">
              {["login", "register", "verify"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setAuthMode(mode);
                    clearMessages();
                  }}
                  className={`px-3 py-1.5 text-sm rounded-md capitalize ${
                    authMode === mode
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {authMode === "register" && (
              <div className="space-y-3">
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleField("name")}
                />
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="School email"
                  value={form.email}
                  onChange={handleField("email")}
                />
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Department (optional)"
                  value={form.department}
                  onChange={handleField("department")}
                />
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleField("password")}
                />
                <button
                  onClick={handleRegister}
                  className="w-full bg-gray-900 text-white text-sm rounded-md py-2"
                >
                  Register
                </button>
              </div>
            )}

            {authMode === "verify" && (
              <div className="space-y-3">
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="User ID (from register response)"
                  value={regUserId}
                  onChange={(e) => setRegUserId(e.target.value)}
                />
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Verification code"
                  value={form.code}
                  onChange={handleField("code")}
                />
                <button
                  onClick={handleVerify}
                  className="w-full bg-gray-900 text-white text-sm rounded-md py-2"
                >
                  Verify
                </button>
              </div>
            )}

            {authMode === "login" && (
              <div className="space-y-3">
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleField("email")}
                />
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleField("password")}
                />
                <button
                  onClick={handleLogin}
                  className="w-full bg-gray-900 text-white text-sm rounded-md py-2"
                >
                  Log in
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Logged in as</p>
                <p className="text-lg font-medium text-gray-900">
                  {user.name}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 border border-gray-300 rounded-md px-3 py-1.5"
              >
                Log out
              </button>
            </div>

            {/* Create post */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <p className="text-sm font-medium text-gray-700 mb-2">
                New post
              </p>
              <div className="flex gap-2">
                <input
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="What's happening..."
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                />
                <button
                  onClick={createPost}
                  className="bg-gray-900 text-white text-sm rounded-md px-4"
                >
                  Post
                </button>
              </div>
            </div>

            {/* Feed */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">Feed</p>
                <button
                  onClick={fetchPosts}
                  className="text-xs text-gray-500 underline"
                >
                  Refresh
                </button>
              </div>

              {posts.length === 0 && (
                <p className="text-sm text-gray-400">No posts yet.</p>
              )}

              {posts.map((post) => {
                const id = post._id || post.id;
                const isEditing = editingPostId === id;
                return (
                  <div
                    key={id}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <p className="text-xs text-gray-400 mb-1">
                      {post.author?.username || "Unknown"}
                    </p>

                    {isEditing ? (
                      <div className="flex gap-2 mb-2">
                        <input
                          className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                        />
                        <button
                          onClick={() => saveEdit(id)}
                          className="text-xs bg-gray-900 text-white rounded-md px-3"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-800 mb-2">
                        {post.text}
                      </p>
                    )}

                    <div className="flex gap-3 text-xs text-gray-500">
                      <button onClick={() => likePost(id)}>
                        Like ({post.likes?.length ?? 0})
                      </button>
                      <button onClick={() => openComments(id)}>
                        Comments ({post.comments?.length ?? 0})
                      </button>
                      <button onClick={() => startEdit(post)}>Edit</button>
                      <button
                        onClick={() => deletePost(id)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </div>

                    {selectedPostId === id && (
                      <div className="mt-3 border-t border-gray-100 pt-3 space-y-2">
                        {comments.length === 0 && (
                          <p className="text-xs text-gray-400">
                            No comments yet.
                          </p>
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
                            className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-xs"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                          />
                          <button
                            onClick={createComment}
                            className="text-xs bg-gray-900 text-white rounded-md px-3"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
