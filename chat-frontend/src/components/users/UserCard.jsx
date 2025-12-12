// src/components/users/UserCard.jsx
import { useNavigate } from "react-router-dom";
import client from "../../api/client";

function UserCard({ user }) {
  const navigate = useNavigate();

  const stored = localStorage.getItem("chatUser");
  const currentUser = stored ? JSON.parse(stored) : null;

  const handleStartChat = async () => {
    if (!currentUser) return;

    try {
      const response = await client.post("/api/chat/creatingchatroom", {
        user1Id: currentUser.userId,
        user2Id: user.userId,
      });

      const roomId =
        response.data.roomId ?? response.data.id ?? response.data.RoomId;

      navigate(`/chat/${roomId}`);
    } catch (err) {
      console.error("Failed to create chat room", err);
      alert("Failed to start chat. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 mb-2">
      <div>
        <p className="font-medium">{user.username}</p>
        <p className="text-xs text-slate-400">{user.phoneNumber}</p>
      </div>

      {currentUser && currentUser.userId !== user.userId && (
        <button
          onClick={handleStartChat}
          className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium"
        >
          Chat
        </button>
      )}
    </div>
  );
}

export default UserCard;
