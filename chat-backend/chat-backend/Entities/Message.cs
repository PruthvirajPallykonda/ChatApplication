namespace chat_backend.Entities
{
    public class Message
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public int SenderId { get; set; }
        public string Text { get; set; } = string.Empty;
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        // Navigation
        public ChatRoom? Room { get; set; }
        public User? Sender { get; set; }
    }
}
