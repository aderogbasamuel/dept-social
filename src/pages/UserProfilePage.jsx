import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE, ENDPOINTS, request } from "../api/client";
import Avatar from "../components/Avatar";
import PostCard from "../components/PostCard";
import Banner from "../components/Banner";
import AppLayout from "../components/AppLayout"
export default function UserProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [followLoading, setFollowLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      const data = await request(ENDPOINTS.userProfile(API_BASE, id));
      setProfile(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchPosts = async () => {
    try {
      const data = await request(ENDPOINTS.userPosts(API_BASE, id));
      setPosts(data.posts || data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    setProfile(null); // reset while loading a different profile
    fetchProfile();
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleFollowToggle = async () => {
    setFollowLoading(true);
    try {
      const data = await request(ENDPOINTS.toggleFollow(API_BASE, id), {
        method: "POST",
      });
      setProfile((prev) => ({
        ...prev,
        isFollowing: data.following,
        followersCount: data.followersCount,
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setFollowLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-emerald-50/40 flex items-center justify-center">
        <p className="text-sm text-gray-400">
          {error || "Loading profile..."}
        </p>
      </div>
    );
  }

  const { user, postsCount, followersCount, followingCount, isFollowing, isOwnProfile } =
    profile;

  return (
  <AppLayout>
          <Banner text={error} type="error" />

          {/* Profile header */}
          <div className="bg-white rounded-2xl p-6 shadow-sm shadow-emerald-900/5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <Avatar
                  name={user.username}
                  avatarUrl={user.avatarUrl}
                  size={16}
                />
                <div>
                  <h1 className="text-lg font-semibold text-emerald-950">
                    {user.username}
                  </h1>
                  {user.department && (
                    <p className="text-sm text-gray-500">{user.department}</p>
                  )}
                </div>
              </div>

              {isOwnProfile ? (
                <button
                  onClick={() => navigate("/profile")}
                  className="text-sm border border-gray-300 rounded-lg px-4 py-1.5 text-gray-600"
                >
                  Edit profile
                </button>
              ) : (
                <button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`text-sm rounded-lg px-4 py-1.5 font-medium disabled:opacity-50 ${
                    isFollowing
                      ? "border border-gray-300 text-gray-600"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>

            <div className="flex items-center gap-5 text-sm text-gray-600">
              <span>
                <span className="font-semibold text-gray-900">
                  {postsCount}
                </span>{" "}
                posts
              </span>
              <span>
                <span className="font-semibold text-gray-900">
                  {followersCount}
                </span>{" "}
                followers
              </span>
              <span>
                <span className="font-semibold text-gray-900">
                  {followingCount}
                </span>{" "}
                following
              </span>
            </div>
          </div>

          {/* Their posts */}
          <div className="bg-white rounded-2xl shadow-sm shadow-emerald-900/5 overflow-hidden">
            {posts.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">
                No posts yet.
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
       </AppLayout>
  );
}