// src/components/chat/MessageInput.jsx
import { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

function MessageInput({ text, setText, sending, onSend, onSendFile, isEditing }) {
  const [showEmoji, setShowEmoji] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend();
    setShowEmoji(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (onSendFile) onSendFile(file);
    e.target.value = "";
  };

  const handleEmojiSelect = (emoji) => {
    // emoji.native is the actual unicode character
    setText((prev) => (prev || "") + emoji.native);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full border-t border-slate-800 px-4 py-3 flex gap-1 sm:gap-2 items-center"
    >
      <label className="flex items-center px-3 py-2 rounded-lg bg-slate-800 text-sm cursor-pointer">
        <span>📎</span>
        <input type="file" className="hidden" onChange={handleFileChange} />
      </label>

      <button
        type="button"
        className="px-2 py-2 rounded-lg bg-slate-800 text-lg"
        onClick={() => setShowEmoji((v) => !v)}
      >
        🙂
      </button>

      {showEmoji && (
        <div className="absolute bottom-14 left-12 z-50">
          <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="dark" />
        </div>
      )}

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={isEditing ? "Edit your message..." : "Type a message..."}
        className="flex-1 rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="submit"
        disabled={sending}
        className="px-3 py-2 text-xs sm:text-sm rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium"
      >
        {sending ? "Sending..." : isEditing ? "Save" : "Send"}
      </button>
    </form>
  );
}

export default MessageInput;
