// src/pages/Chat/ChatRoomsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";

function ChatRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const stored = localStorage.getItem("chatUser");
  const currentUser = stored ? JSON.parse(stored) : null;

  const navigate = useNavigate();

  const fetchRooms = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await client.get("/chat/getall/chatrooms");
      setRooms(res.data || []);
    } catch {
      setError("Failed to load rooms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleOpenRoom = (roomId) => {
    navigate(`/chat/${roomId}`);
  };

  const getRoomSubtitle = (room) => {
    if (!currentUser) return `Room #${room.id}`;
    const meId = currentUser.userId;
    const otherName =
      room.user1Id === meId ? room.user2Name : room.user1Name;
    return `Room #${room.id} · ${otherName}`;
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left: rooms list */}
      <aside className="w-100 border-r border-slate-800 bg-slate-900 flex flex-col">
        <header className="h-14 flex items-center px-4 border-b border-slate-800">
          <h1 className="text-lg font-semibold">Chat Rooms</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loading && (
            <p className="text-sm text-slate-400">Loading rooms...</p>
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}

          {!loading && !error && rooms.length === 0 && (
            <p className="text-sm text-slate-400">
              No rooms yet. Start a conversation from Users page.
            </p>
          )}

          {rooms.map((room) => (
            <div
              key={room.id}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-left"
            >
              <div className="flex flex-col">
                <span className="font-medium">
                  {room.name || getRoomSubtitle(room)}
                </span>
                <span className="text-xs text-slate-400">
                  {room.name ? getRoomSubtitle(room) : ""}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleOpenRoom(room.id)}
                className="text-xs px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500"
              >
                Open
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Right: placeholder (chat content lives in /chat/:roomId page) */}
      <section className="flex-1 flex items-center justify-center">
        <p className="text-sm text-slate-400">
          Select a room on the left to open the chat.
        </p>
      </section>
    </div>
  );
}

export default ChatRoomsPage;
