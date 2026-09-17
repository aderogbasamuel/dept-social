import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Users, Lock } from "lucide-react";
import { API_BASE, ENDPOINTS, request } from "../api/client";
import Sidebar from "../components/Sidebar";
import Avatar from "../components/Avatar";
import PostCard from "../components/PostCard";
import Banner from "../components/Banner";
import AppLayout from "../components/AppLayout";

export default function GroupDetailPage() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [tab, setTab] = useState("posts");
  const [error, setError] = useState("");
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);

  const fetchGroup = async () => {
    try {
      const res = await request(ENDPOINTS.group(API_BASE, id));
      setData(res);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await request(ENDPOINTS.groupFeed(API_BASE, id));
      setPosts(res.posts || res || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await request(ENDPOINTS.groupMembers(API_BASE, id));
      setMembers(res.members || res || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    setData(null);
    fetchGroup();
    fetchPosts();
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleJoin = async () => {
    try {
      const res = await request(ENDPOINTS.joinGroup(API_BASE, id), {
        method: "POST",
      });
      setData((prev) => ({
        ...prev,
        isMember: res.joined,
        group: { ...prev.group, memberCount: res.memberCount },
      }));
      fetchMembers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePost = async () => {
    if (!newPost.trim()) return;
    setPosting(true);
    setError("");
    try {
      await request(ENDPOINTS.posts(API_BASE), {
        method: "POST",
        body: JSON.stringify({ text: newPost, group: id }),
      });
      setNewPost("");
      fetchPosts();
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-emerald-50/40 dark:bg-gray-950 flex items-center justify-center">
        <p className="text-sm text-gray-400">{error || "Loading group..."}</p>
      </div>
    );
  }

  const { group, isMember, role } = data;

  return (
    <AppLayout>
          <Banner text={error} type="error" />

          {/* Group header */}
          <div className="bg-white dark:bg-gray-900 dark:border dark:border-gray-800 rounded-2xl p-3 py-4 shadow-sm shadow-emerald-900/5 dark:shadow-none">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <Avatar name={group.name} avatarUrl={group.avatar} size={16} />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-lg font-semibold text-emerald-950 dark:text-emerald-100">
                      {group.name}
                    </h1>
                    {group.privacy === "private" && (
                      <Lock size={13} className="text-gray-400" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Users size={11} /> {group.memberCount ?? 0} members
                    {role === "admin" && (
                      <span className="ml-1 text-emerald-600 font-medium">
                        · Admin
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={handleJoin}
                className={`text-sm rounded-lg px-4 py-1.5 font-medium ${
                  isMember
                    ? "border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {isMember ? "Joined" : "Join"}
              </button>
            </div>

            {group.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {group.description}
              </p>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {["posts", "members"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-sm rounded-lg px-4 py-1.5 capitalize ${
                  tab === t
                    ? "bg-emerald-600 text-white font-medium"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "posts" && (
            <>
              {/* Only members can post — mirrors the backend rule */}
              {isMember ? (
                <div className="bg-white dark:bg-gray-900 dark:border dark:border-gray-800 rounded-2xl p-4 shadow-sm shadow-emerald-900/5 dark:shadow-none">
                  <div className="flex gap-2">
                    <input
                      className="flex-1 bg-emerald-50/60 dark:bg-gray-800 rounded-full px-4 py-2.5 text-sm outline-none placeholder:text-gray-400"
                      placeholder={`Post in ${group.name}...`}
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handlePost()}
                    />
                    <button
                      onClick={handlePost}
                      disabled={posting}
                      className="bg-emerald-600 text-white text-xs font-medium rounded-full px-4 disabled:opacity-50"
                    >
                      {posting ? "..." : "Post"}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-3">
                  Join this group to post in it.
                </p>
              )}

              <div className="  dark:shadow-none overflow-hidden">
                {posts.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-8">
                    No posts in this group yet.
                  </p>
                )}
                {posts.map((post) => (
                  <PostCard
                    key={post._id || post.id}
                    post={post}
                    onChanged={fetchPosts}
                    onError={setError}
                  />
                ))}
              </div>
            </>
          )}

          {tab === "members" && (
            <div className="bg-white dark:bg-gray-900 dark:border dark:border-gray-800 rounded-2xl p-4 shadow-sm shadow-emerald-900/5 dark:shadow-none flex flex-col gap-3">
              {members.map((m) => (
                <div key={m._id} className="flex items-center gap-3">
                  <Avatar
                    name={m.user?.username}
                    avatarUrl={m.user?.avatarUrl}
                    size={10}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {m.user?.username}
                    </p>
                    {m.user?.department && (
                      <p className="text-xs text-gray-400">
                        {m.user.department}
                      </p>
                    )}
                  </div>
                  {m.role === "admin" && (
                    <span className="text-xs text-emerald-600 font-medium">
                      Admin
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </AppLayout>
  );
}