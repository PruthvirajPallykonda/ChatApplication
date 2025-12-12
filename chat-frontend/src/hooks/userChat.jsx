import { useEffect, useState } from "react";
import client from "../api/client";

function useChat(roomId) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const stored = localStorage.getItem("chatUser");
  const currentUser = stored ? JSON.parse(stored) : null;
  const currentUserId = currentUser?.userId;

  const fetchMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await client.get(
        `/api/chat/get/messages/usingroomid/${roomId}`
      );
      setMessages(res.data);
    } catch {
      setError("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!roomId) return;
    fetchMessages();
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
          text,
          sentAt: new Date().toISOString(),
        },
      ]);

      setText(""); // clear input after send
    } catch {
      setError("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return {
    currentUserId,
    messages,
    text,
    setText,
    loading,
    sending,
    error,
    handleSend,
  };
}

export default useChat;
