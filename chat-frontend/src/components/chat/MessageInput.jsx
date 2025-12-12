function MessageInput({ text, setText, sending, onSend }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSend();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full border-t border-slate-800 px-4 py-3 flex gap-3"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="submit"
        disabled={sending}
        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium"
      >
        {sending ? "Sending..." : "Send"}
      </button>
    </form>
  );
}

export default MessageInput;
