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
      const response = await client.post("/chat/creatingchatroom", {
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
    <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 sm:px-4 py-2 sm:py-3 mb-2">
      <div>
        <p className="font-medium">{user.username}</p>
        <p className="text-xs text-slate-400">{user.phoneNumber}</p>
      </div>

      {currentUser && currentUser.userId !== user.userId && (
        <button className="px-3 py-2 sm:py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium whitespace-nowrap">
          Chat
        </button>
      )}
    </div>
  );
}

export default UserCard;
