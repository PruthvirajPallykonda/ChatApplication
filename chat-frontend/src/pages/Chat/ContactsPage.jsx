// src/pages/Chat/ContactsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";

function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const stored = localStorage.getItem("chatUser");
  const currentUser = stored ? JSON.parse(stored) : null;
  const currentUserId = currentUser?.userId;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await client.get("/api/chat/contacts");
        setContacts(res.data || []);
      } catch {
        setError("Failed to load contacts.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = contacts.filter((c) =>
    c.contactName.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenChat = (roomId) => {
    navigate(`/chat/${roomId}`);
  };

  // optional: if there is no room yet
  const handleStartNewChat = async (contactId) => {
    if (!currentUserId) return;
    try {
      const res = await client.post("/api/chat/creatingchatroom", {
        user1Id: currentUserId,
        user2Id: contactId,
      });
      const { roomId } = res.data;
      navigate(`/chat/${roomId}`);
    } catch {
      alert("Failed to start chat");
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <header className="h-12 flex items-center px-4 border-b border-slate-800">
        <h1 className="text-base font-semibold mr-4">Contacts</h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search contacts..."
          className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm flex-1 max-w-xs"
        />
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        {loading && (
          <p className="text-sm text-slate-400">Loading contacts...</p>
        )}
        {error && <p className="text-sm text-red-400">{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <p className="text-sm text-slate-400">
            No contacts yet. Start a new chat from Rooms.
          </p>
        )}

        <div className="space-y-2">
          {filtered.map((c) => (
            <button
              key={c.roomId}
              onClick={() =>
                c.roomId ? handleOpenChat(c.roomId) : handleStartNewChat(c.contactId)
              }
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-left"
            >
              <span className="font-medium">{c.contactName}</span>
              <span className="text-xs text-slate-400">
                {c.roomId ? "Open chat" : "Start chat"}
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

export default ContactsPage;
