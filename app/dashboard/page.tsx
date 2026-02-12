"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  // 🔹 Get Logged In User
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/");
      } else {
        setUser(data.user);
        setLoading(false);
      }
    };

    getUser();
  }, [router]);

  // 🔹 Fetch initial bookmarks
  useEffect(() => {
    if (!user) return;

    const fetchInitial = async () => {
      const { data } = await supabase
        .from("bookmarks")
        .select("*")
        .order("created_at", { ascending: false });

      setBookmarks(data || []);
    };

    fetchInitial();
  }, [user]);

  // 🔹 Realtime
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBookmarks((prev) => [payload.new, ...prev]);
          }

          if (payload.eventType === "DELETE") {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
          }

          if (payload.eventType === "UPDATE") {
            setBookmarks((prev) =>
              prev.map((b) => (b.id === payload.new.id ? payload.new : b)),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // 🔹 Add Bookmark
  const addBookmark = async () => {
    if (!title || !url) return;

    await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user.id,
    });

    setTitle("");
    setUrl("");
  };

  // 🔹 Delete Bookmark
  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  // 🔹 Start Edit
  const startEdit = (bookmark: any) => {
    setEditingId(bookmark.id);
    setEditTitle(bookmark.title);
  };

  // 🔹 Save Edit
  const saveEdit = async (id: string) => {
    if (!editTitle) return;

    await supabase.from("bookmarks").update({ title: editTitle }).eq("id", id);

    setEditingId(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) return <p className="p-6 text-white">Loading...</p>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-wide">My Bookmarks</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Add Form */}
        <div className="bg-zinc-900 p-4 rounded-xl mb-6 flex gap-3 shadow-lg">
          <input
            type="text"
            placeholder="Bookmark title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 flex-1 focus:outline-none focus:border-blue-500"
          />

          <input
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 flex-1 focus:outline-none focus:border-blue-500"
          />

          <button
            onClick={addBookmark}
            className="bg-blue-600 hover:bg-blue-700 px-4 rounded-lg"
          >
            Add
          </button>
        </div>

        {/* Bookmarks */}
        <div className="space-y-4">
          {bookmarks.length === 0 && (
            <p className="text-gray-400 text-center">No bookmarks yet.</p>
          )}

          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="bg-zinc-900 p-4 rounded-xl flex justify-between items-center shadow-md"
            >
              <div className="flex-1">
                {editingId === bookmark.id ? (
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 p-2 rounded-lg w-full mb-2"
                  />
                ) : (
                  <h3 className="font-semibold text-lg">{bookmark.title}</h3>
                )}

                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-sm hover:underline"
                >
                  {bookmark.url}
                </a>
              </div>

              <div className="flex gap-4 ml-4 text-xl">
                {editingId === bookmark.id ? (
                  <button
                    onClick={() => saveEdit(bookmark.id)}
                    className="text-green-400 hover:text-green-500"
                  >
                    ✔
                  </button>
                ) : (
                  <button
                    onClick={() => startEdit(bookmark)}
                    className="text-blue-400 hover:text-blue-500"
                  >
                    ✏️
                  </button>
                )}

                <button
                  onClick={() => deleteBookmark(bookmark.id)}
                  className="text-red-400 hover:text-red-500"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
