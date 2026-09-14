// ---------------------------------------------------------------------------
// Set this to your deployed backend, or override with a .env value:
// VITE_API_BASE_URL=https://dept-social-api.onrender.com/api
// ---------------------------------------------------------------------------
export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://dept-social-api.onrender.com/api";

export const ENDPOINTS = {
  register: (base) => `${base}/auth/signup`,
  verify: (base) => `${base}/auth/verify-email`,
  login: (base) => `${base}/auth/login`,
  logout: (base) => `${base}/auth/logout`,

  posts: (base) => `${base}/posts`,
  post: (base, id) => `${base}/posts/${id}`,
  likePost: (base, id) => `${base}/posts/${id}/like`,

  comments: (base) => `${base}/comments`,
  commentsForPost: (base, postId) => `${base}/comments/${postId}`,

  // NOTE: assuming this is mounted at /api/statuses — adjust if different
  statuses: (base) => `${base}/statuses`,
  status: (base, id) => `${base}/statuses/${id}`,
  likeStatus: (base, id) => `${base}/statuses/${id}/like`,
};

export async function request(url, options = {}) {
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