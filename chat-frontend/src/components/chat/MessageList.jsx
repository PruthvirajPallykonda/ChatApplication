import React from "react";

function MessageList({ messages, currentUserId }) {
  if (!messages || messages.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        No messages yet. Start the conversation.
      </p>
    );
  }

  return (
    <div className="w-full flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg) => {
        const isMine = msg.senderId === currentUserId;

        return (
          <div
            key={msg.id}
            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`
                max-w-[75%] 
                rounded-2xl px-3 py-2 text-sm 
                break-words overflow-hidden
                ${isMine ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-100"}
              `}
            >
              <div>{msg.text}</div>

              {msg.sentAt && (
                <div className="mt-1 text-[10px] opacity-70 text-right">
                  {new Date(msg.sentAt).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MessageList;
