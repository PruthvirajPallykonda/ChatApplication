namespace chat_backend.Entities
{
    public class Message
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public int SenderId { get; set; }
        public string Text { get; set; } = string.Empty;
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "sent";

        // Entities/Message.cs
        public ICollection<MessageReaction> Reactions { get; set; } = new List<MessageReaction>();


        public string? FileUrl { get; set; }
        public string? FileName { get; set; }
        public string? FileType { get; set; }

        // Navigation
        public ChatRoom? Room { get; set; }
        public User? Sender { get; set; }
    }
}
