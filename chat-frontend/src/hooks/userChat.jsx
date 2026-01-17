import { useEffect, useState } from "react";
import client from "../api/client";

function normalizeMessages(raw) {
  const apiBase = import.meta.env.VITE_API_BASE_URL || "https://chatapplication-production-48d0.up.railway.app";
  return (raw || []).map((m) => ({
    ...m,
    fileUrl: m.fileUrl
      ? m.fileUrl.startsWith("http")
        ? m.fileUrl
        : `${apiBase}${m.fileUrl}`
      : null,
  }));
}

function useChat(roomId) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [roomInfo, setRoomInfo] = useState(null);

  const stored = localStorage.getItem("chatUser");
  const currentUser = stored ? JSON.parse(stored) : null;
  const currentUserId = currentUser?.userId;

  const fetchMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await client.get(`/api/chat/get/messages/usingroomid/${roomId}`);
      setMessages(normalizeMessages(res.data));
    } catch {
      setError("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomInfo = async () => {
    try {
      const res = await client.get("/api/chat/getall/chatrooms");
      const allRooms = res.data || [];
      const room = allRooms.find((r) => r.id === Number(roomId));
      if (room) setRoomInfo(room);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!roomId) return;
    fetchMessages();
    fetchRoomInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const handleSend = async () => {
    if (!text.trim() || !currentUserId) return;

    setSending(true);
    setError("");

    try {
      const res = await client.post("/api/chat/sendmessage", {
        roomId: Number(roomId),
        senderId: currentUserId,
        text,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: res.data.id,
          roomId: Number(roomId),
          senderId: currentUserId,
          senderName: currentUser?.username,
          text,
          sentAt: new Date().toISOString(),
          status: "sent",
          fileUrl: null,
        },
      ]);

      setText("");
    } catch {
      setError("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return {
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
  };
}

export default useChat;
