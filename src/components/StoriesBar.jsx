
import { useState, useEffect } from "react";
import {
  Plus,
  X,
  Heart,
  Trash2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { API_BASE, ENDPOINTS, request } from "../api/client";
import Avatar from "./Avatar";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export default function StoriesBar({ onError }) {
  const { user } = useAuth();

  const [statuses, setStatuses] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [newText, setNewText] = useState("");
  const [liked, setLiked] = useState({});

  const fetchStatuses = async () => {
    try {
      const data = await request(ENDPOINTS.statuses(API_BASE));
      setStatuses(data.statuses || data || []);
    } catch (err) {
      onError?.(err.message);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  /*
   * Group all statuses by author.
   *
   * Instead of:
   *
   * Samuel -> newest story only
   *
   * We now have:
   *
   * Samuel -> [story1, story2, story3]
   */
  const storiesByAuthor = statuses.reduce((acc, status) => {
    const authorId = status.author?._id || status.author;

    if (!acc[authorId]) {
      acc[authorId] = [];
    }

    acc[authorId].push(status);

    return acc;
  }, {});

  // Sort each author's stories from oldest -> newest
  Object.values(storiesByAuthor).forEach((stories) => {
    stories.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  });

  const authorIds = Object.keys(storiesByAuthor);

  const storyTiles = authorIds.map((authorId) => {
    const stories = storiesByAuthor[authorId];

    return {
      authorId,
      stories,
      latestStory: stories[stories.length - 1],
    };
  });

  const selectedStories =
    selectedAuthor !== null
      ? storiesByAuthor[selectedAuthor] || []
      : [];

  const selected = selectedStories[storyIndex];

  const openStory = (authorId) => {
    setSelectedAuthor(authorId);
    setStoryIndex(0);
  };

  const closeStory = () => {
    setSelectedAuthor(null);
    setStoryIndex(0);
  };

  const nextStory = () => {
    if (storyIndex < selectedStories.length - 1) {
      setStoryIndex((index) => index + 1);
    } else {
      closeStory();
    }
  };

  const previousStory = () => {
    if (storyIndex > 0) {
      setStoryIndex((index) => index - 1);
    }
  };

  const handleCreate = async () => {
    if (!newText.trim()) return;

    try {
      await request(ENDPOINTS.statuses(API_BASE), {
        method: "POST",
        body: JSON.stringify({ text: newText }),
      });

      setNewText("");
      setShowCreate(false);

      toast.success("Status posted");
      fetchStatuses();
    } catch (err) {
      onError?.(err.message);
    }
  };

  const handleLike = async (id) => {
    try {
      await request(ENDPOINTS.likeStatus(API_BASE, id), {
        method: "POST",
      });

      setLiked((l) => ({
        ...l,
        [id]: !l[id],
      }));

      toast.success(liked[id] ? "Like removed" : "Status liked");

      fetchStatuses();
    } catch (err) {
      onError?.(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await request(ENDPOINTS.status(API_BASE, id), {
        method: "DELETE",
      });

      toast.success("Status deleted");

      // Move to next story if possible, otherwise close
      if (selectedStories.length > 1) {
        if (storyIndex < selectedStories.length - 1) {
          setStoryIndex((index) => index);
        } else {
          closeStory();
        }
      } else {
        closeStory();
      }

      fetchStatuses();
    } catch (err) {
      onError?.(err.message);
    }
  };

  return (
    <>
      {/* ================= STORIES BAR ================= */}

      <div className="border-gray-100 border-b  pb-4 flex items-center gap-4 overflow-x-auto px-4 pt-4 dark:border-gray-800 mt-2">
        {/* Your story */}
        <button
          onClick={() => setShowCreate(true)}
          className="flex flex-col items-center gap-1.5 shrink-0"
        >
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-emerald-300 flex items-center justify-center">
            <Plus size={18} className="text-emerald-500" />
          </div>

          <span className="text-xs text-gray-500 dark:text-gray-400">
            Your story
          </span>
        </button>

        {/* Other users */}
        {storyTiles.map(({ authorId, stories, latestStory }) => (
          <button
            key={authorId}
            onClick={() => openStory(authorId)}
            className="flex flex-col items-center gap-1.5 shrink-0"
          >
            <div
              className={`rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 p-[2px] ${
                stories.length > 1 ? "ring-2 ring-emerald-200" : ""
              }`}
            >
              <div className=" rounded-full bg-white p-0.5">
                <Avatar
                  name={latestStory.author?.username}
                  size={12}
                />
              </div>
            </div>

            <span className="text-xs text-gray-500 max-w-[56px] truncate">
              {latestStory.author?.username || "Unknown"}
            </span>
          </button>
        ))}

        {storyTiles.length === 0 && (
          <p className="text-xs text-gray-400">
            No status updates yet.
          </p>
        )}

        <button className="ml-auto shrink-0 text-emerald-500">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* ================= CREATE STATUS ================= */}

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-sm text-gray-800">
                New status
              </p>

              <button onClick={() => setShowCreate(false)}>
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 resize-none"
              rows={3}
              placeholder="What's your status?"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              autoFocus
            />

            <button
              onClick={handleCreate}
              className="w-full bg-emerald-600 text-white text-sm rounded-lg py-2 font-medium"
            >
              Post status
            </button>
          </div>
        </div>
      )}

      {/* ================= FULL SCREEN STORY VIEWER ================= */}

      {selected && (
        <div className="fixed inset-0 z-[100] bg-black">
          {/* Progress bars */}
          <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 px-3 pt-3">
            {selectedStories.map((story, index) => (
              <div
                key={story._id || story.id}
                className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden"
              >
                <div
                  className={`h-full rounded-full transition-all ${
                    index < storyIndex
                      ? "w-full bg-white"
                      : index === storyIndex
                      ? "w-full bg-white"
                      : "w-0"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-7 left-0 right-0 z-20 px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar
                name={selected.author?.username}
                size={10}
                avatarUrl={selected.author?.avatarUrl}
              />

              <div>
                <p className="text-sm font-medium text-white">
                  {selected.author?.username || "Unknown"}
                </p>

                <p className="text-xs text-white/60">
                  {new Date(selected.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <button
              onClick={closeStory}
              className="w-9 h-9 rounded-full bg-black/30 flex items-center justify-center text-white hover:bg-black/50 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Story content */}
          <div className="absolute inset-0 flex items-center justify-center px-5">
            <div className="w-full max-w-2xl text-center">
              <p className="text-white text-2xl sm:text-3xl md:text-4xl font-medium leading-relaxed break-words">
                {selected.text}
              </p>
            </div>
          </div>

          {/* Previous button */}
          {storyIndex > 0 && (
            <button
              onClick={previousStory}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Next button */}
          <button
            onClick={nextStory}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center"
          >
            <ChevronRight size={24} />
          </button>

          {/* Bottom actions */}
          <div className="absolute bottom-6 left-0 right-0 z-20 px-5">
            <div className="flex items-center justify-between">
              <button
                onClick={() =>
                  handleLike(selected._id || selected.id)
                }
                className="flex items-center gap-2 text-white"
              >
                <Heart
                  size={22}
                  fill={
                    liked[selected._id || selected.id]
                      ? "currentColor"
                      : "none"
                  }
                />

                <span className="text-sm">
                  {(selected.likes?.length ?? 0) +
                    (liked[selected._id || selected.id] ? 1 : 0)}
                </span>
              </button>

              {selected.author?.username === user?.username && (
                <button
                  onClick={() =>
                    handleDelete(selected._id || selected.id)
                  }
                  className="flex items-center gap-2 text-white/70 hover:text-white"
                >
                  <Trash2 size={18} />
                  <span className="text-sm">Delete</span>
                </button>
              )}
            </div>
          </div>

          {/* Invisible navigation zones */}
          <button
            onClick={previousStory}
            className="absolute left-0 top-0 bottom-0 w-1/3 z-10"
            aria-label="Previous story"
          />

          <button
            onClick={nextStory}
            className="absolute right-0 top-0 bottom-0 w-1/3 z-10"
            aria-label="Next story"
          />
        </div>
      )}
    </>
  );
}
