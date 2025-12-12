namespace chat_backend.DTO_s.Chat
{
    public class MessageDto
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public int SenderId { get; set; }
        public string Text { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }
    }
}
