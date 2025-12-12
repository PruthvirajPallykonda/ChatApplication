import { useParams } from "react-router-dom";
import useChat from "../../hooks/userChat";
import MessageList from "../../components/chat/MessageList";
import MessageInput from "../../components/chat/MessageInput";

function ChatRoomPage() {
  const { roomId } = useParams();

  const {
    currentUserId,
    messages,
    text,
    setText,
    loading,
    sending,
    error,
    handleSend,
  } = useChat(roomId);

  return (
    <div className="h-screen w-screen bg-slate-900 text-slate-100 flex flex-col overflow-hidden">

      {/* Sticky Header */}
      <header className="h-14 flex items-center px-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
        <h1 className="text-lg font-semibold">Room #{roomId}</h1>
      </header>

      {/* Main Content Wrapper */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Scrollable Messages */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 pb-32">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-slate-400">Loading messages...</p>
            </div>
          ) : (
            <MessageList messages={messages} currentUserId={currentUserId} />
          )}

          {error && (
            <div className="px-4 pb-4 text-xs text-red-400">{error}</div>
          )}
        </div>

        {/* Sticky Input Box */}
        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 p-3 z-50">
          <MessageInput
            text={text}
            setText={setText}
            sending={sending}
            onSend={handleSend}
          />
        </div>

      </main>
    </div>
  );
}

export default ChatRoomPage;
