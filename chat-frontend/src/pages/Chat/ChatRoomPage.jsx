import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import useChat from "../../hooks/userChat";
import MessageList from "../../components/chat/MessageList";
import MessageInput from "../../components/chat/MessageInput";
import client from "../../api/client";

function ChatRoomPage() {
  const { roomId } = useParams();

  const {
    currentUser,
    currentUserId,
    roomInfo,
    messages,
    setMessages,
    text,
    setText,
    loading,
    sending,
    error,
    handleSend,
    fetchRoomInfo,
  } = useChat(roomId);

  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);

  const myMessages = messages.filter((m) => m.senderId === currentUserId);
  const lastMyMessage =
    myMessages.length > 0 ? myMessages[myMessages.length - 1] : null;

  const canEditLastMessage = (msg) => {
    if (!lastMyMessage || msg.id !== lastMyMessage.id) return false;
    if (!msg.sentAt) return false;
    const diffMs = Date.now() - new Date(msg.sentAt).getTime();
    return diffMs <= 5 * 60 * 1000;
  };

  let headerTitle = roomInfo?.name;
  if (!headerTitle && roomInfo && currentUser) {
    if (roomInfo.user1Id === currentUser.userId) {
      headerTitle = roomInfo.user2Name;
    } else if (roomInfo.user2Id === currentUser.userId) {
      headerTitle = roomInfo.user1Name;
    }
  }
  if (!headerTitle) headerTitle = `Room #${roomId}`;

  useEffect(() => {
    setNewName(headerTitle);
  }, [roomId, roomInfo]);

  const handleStartEdit = () => {
    setNewName(headerTitle);
    setEditingName(true);
  };

  const handleSaveName = async () => {
    try {
      await client.put(`/chat/${roomId}/name`, { name: newName });
      setEditingName(false);
      await fetchRoomInfo();
    } catch {
      alert("Failed to update room name");
    }
  };

  const handleEditMessage = (msg) => {
    setEditingMessageId(msg.id);
    setText(msg.text || "");
  };

  const handleDeleteMessage = async (msg) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await client.delete(`/chat/messages/${msg.id}`);
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
    } catch {
      alert("Failed to delete message");
    }
  };

  const handleSendFile = async (file) => {
    if (!file || !currentUserId) return;
    const formData = new FormData();
    formData.append("File", file);
    formData.append("RoomId", roomId);
    formData.append("SenderId", currentUserId);

    try {
      const res = await client.post("/chat/sendfile", formData);
      const { id, fileUrl, fileName, fileType } = res.data;

      // Fixed: Use same dynamic baseURL as userChat.js
      const apiBase = import.meta.env.VITE_API_BASE_URL || "https://chatapplication-production-48d0.up.railway.app";
      const fullUrl = fileUrl.startsWith("http")
        ? fileUrl
        : `${apiBase}${fileUrl}`;

      setMessages((prev) => [
        ...prev,
        {
          id,
          roomId: Number(roomId),
          senderId: currentUserId,
          senderName: currentUser?.username,
          text: "",
          sentAt: new Date().toISOString(),
          status: "sent",
          fileUrl: fullUrl,
          fileName,
          fileType,
        },
      ]);
    } catch {
      alert("Failed to send file");
    }
  };

  const handleSendOrUpdate = async () => {
    if (!text.trim()) return;

    if (editingMessageId) {
      try {
        await client.put(`/chat/messages/${editingMessageId}`, {
          text: text.trim(),
        });

        setMessages((prev) =>
          prev.map((m) =>
            m.id === editingMessageId ? { ...m, text: text.trim() } : m
          )
        );
        setEditingMessageId(null);
        setText("");
      } catch {
        alert("Failed to update message");
      }
    } else {
      await handleSend();
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col overflow-hidden">
      <header className="h-14 flex items-center px-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
        {editingName ? (
          <div className="flex items-center gap-2">
            <input
              className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button
              onClick={handleSaveName}
              className="text-xs px-2 py-1 rounded bg-indigo-600"
            >
              Save
            </button>
            <button
              onClick={() => setEditingName(false)}
              className="text-xs px-2 py-1 rounded bg-slate-700"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">{headerTitle}</h1>
            <button
              onClick={handleStartEdit}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Edit
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 sm:px-4 pb-32">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-slate-400">Loading messages...</p>
            </div>
          ) : (
            <MessageList
              messages={messages}
              currentUserId={currentUserId}
              onEditMessage={handleEditMessage}
              onDeleteMessage={handleDeleteMessage}
              editingMessageId={editingMessageId}
              canEditLastMessage={canEditLastMessage}
            />
          )}

          {error && (
            <div className="px-4 pb-4 text-xs text-red-400">{error}</div>
          )}
        </div>

        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 p-2 sm:p-3 z-50">
          <MessageInput
            text={text}
            setText={setText}
            sending={sending}
            onSend={handleSendOrUpdate}
            onSendFile={handleSendFile}
            isEditing={!!editingMessageId}
          />
        </div>
      </main>
    </div>
  );
}

export default ChatRoomPage;
