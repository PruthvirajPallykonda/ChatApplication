import React from "react";
import { MdDone, MdDoneAll } from "react-icons/md";

/* ✅ Emoji-only detector */
const isEmojiOnly = (text) => {
  if (!text) return false;

  const trimmed = text.trim();
  const emojiRegex = /^[\p{Emoji}\u200d\uFE0F]+$/u;

  return emojiRegex.test(trimmed);
};

function MessageList({
  messages,
  currentUserId,
  onEditMessage,
  onDeleteMessage,
}) {
  if (!messages || messages.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        No messages yet. Start the conversation.
      </p>
    );
  }

  const renderStatusIcon = (msg, isMine) => {
    if (!isMine) return null;

    if (msg.status === "sent") {
      return <MdDone className="text-xs text-slate-400" />;
    }
    if (msg.status === "delivered") {
      return <MdDoneAll className="text-xs text-slate-400" />;
    }
    if (msg.status === "read") {
      return <MdDoneAll className="text-xs text-sky-400" />;
    }
    return null;
  };

  return (
    <div className="w-full flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg) => {
        const isMine = msg.senderId === currentUserId;
        const nameLabel = isMine
          ? "You"
          : msg.senderName || `User ${msg.senderId}`;

        const emojiOnly = isEmojiOnly(msg.text);

        return (
          <div
            key={msg.id}
            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
          >
            <div className="max-w-[75%]">
              <p className="text-[11px] text-slate-400 mb-1">
                {nameLabel}
              </p>

              {/* ✅ MESSAGE CONTAINER */}
              <div
                className={
                  emojiOnly && !msg.fileUrl
                    ? "text-5xl leading-none select-none"
                    : `rounded-2xl px-3 py-2 text-sm break-words overflow-hidden ${
                        isMine
                          ? "bg-indigo-600 text-white ml-auto"
                          : "bg-slate-800 text-slate-100"
                      }`
                }
              >
                {/* ✅ IMAGE MESSAGE */}
                {msg.fileUrl ? (
                  <img
                    src={msg.fileUrl}
                    alt={msg.fileName || "image"}
                    className="max-w-full max-h-64 rounded-lg cursor-pointer"
                    onClick={() =>
                      window.open(msg.fileUrl, "_blank")
                    }
                  />
                ) : (
                  /* ✅ TEXT / EMOJI MESSAGE */
                  <div>{msg.text}</div>
                )}

                {/* ❌ Hide footer for emoji-only messages */}
                {!emojiOnly && (
                  <div className="mt-1 flex items-center justify-between gap-2 text-[10px] opacity-70">
                    {isMine && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            onEditMessage && onEditMessage(msg)
                          }
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onDeleteMessage && onDeleteMessage(msg)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-1 ml-auto">
                      {msg.sentAt && (
                        <span>
                          {new Date(msg.sentAt).toLocaleTimeString()}
                        </span>
                      )}
                      {renderStatusIcon(msg, isMine)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MessageList;
