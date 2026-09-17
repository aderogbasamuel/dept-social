import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, X, Lock } from "lucide-react";
import { API_BASE, ENDPOINTS, request } from "../api/client";
import Sidebar from "../components/Sidebar";
import Avatar from "../components/Avatar";
import Banner from "../components/Banner";
import AppLayout from "../components/AppLayout";

export default function GroupsPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    privacy: "public",
  });
  const [creating, setCreating] = useState(false);

  const fetchGroups = async () => {
    try {
      const data = await request(ENDPOINTS.groups(API_BASE));
      setGroups(data.groups || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreate = async () => {
    if (!form.name.trim()) {
      setError("Group name is required");
      return;
    }
    setCreating(true);
    setError("");
    try {
      const group = await request(ENDPOINTS.groups(API_BASE), {
        method: "POST",
        body: JSON.stringify(form),
      });
      setShowCreate(false);
      setForm({ name: "", description: "", privacy: "public" });
      navigate(`/groups/${group._id || group.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async (e, id) => {
    e.stopPropagation(); // don't navigate into the group
    try {
      const data = await request(ENDPOINTS.joinGroup(API_BASE, id), {
        method: "POST",
      });
      setGroups((prev) =>
        prev.map((g) =>
          (g._id || g.id) === id
            ? { ...g, isMember: data.joined, memberCount: data.memberCount }
            : g
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AppLayout>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-emerald-950 dark:text-emerald-100">
                Groups
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Join a group to see its posts in your feed
              </p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 bg-emerald-600 text-white text-sm font-medium rounded-xl px-4 py-2"
            >
              <Plus size={16} /> New group
            </button>
          </div>

          <Banner text={error} type="error" />

          {loading && (
            <p className="text-sm text-gray-400 text-center py-8">
              Loading groups...
            </p>
          )}

          {!loading && groups.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">
              No groups yet — create the first one.
            </p>
          )}

          <div className="flex flex-col gap-3">
            {groups.map((g) => {
              const id = g._id || g.id;
              return (
                <div
                  key={id}
                  onClick={() => navigate(`/groups/${id}`)}
                  className="bg-white dark:bg-gray-900 dark:border dark:border-gray-800 rounded-2xl p-2 shadow-sm shadow-emerald-900/5 dark:shadow-none flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-850 transition-colors"
                >
                  <Avatar name={g.name} avatarUrl={g.avatar} size={12} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {g.name}
                      </p>
                      {g.privacy === "private" && (
                        <Lock size={12} className="text-gray-400 shrink-0" />
                      )}
                    </div>
                    {g.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {g.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Users size={11} /> {g.memberCount ?? 0} members
                    </p>
                  </div>

                  <button
                    onClick={(e) => handleJoin(e, id)}
                    className={`text-xs rounded-lg px-3 py-1.5 font-medium shrink-0 ${
                      g.isMember
                        ? "border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                        : "bg-emerald-600 text-white"
                    }`}
                  >
                    {g.isMember ? "Joined" : "Join"}
                  </button>
                </div>
              );
            })}
          </div>

      {/* Create group modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                Create a group
              </p>
              <button onClick={() => setShowCreate(false)}>
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-lg px-3 py-2 text-sm"
                placeholder="Group name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoFocus
              />
              <textarea
                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-lg px-3 py-2 text-sm resize-none"
                rows={3}
                placeholder="What's this group about?"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <div className="flex gap-2">
                {["public", "private"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setForm({ ...form, privacy: p })}
                    className={`flex-1 text-xs rounded-lg py-2 capitalize ${
                      form.privacy === p
                        ? "bg-emerald-600 text-white"
                        : "border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCreate}
                disabled={creating}
                className="w-full bg-emerald-600 text-white text-sm rounded-lg py-2.5 font-medium disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create group"}
              </button>
            </div>
          </div>
        </div>
      )}
   </AppLayout>
  );
}