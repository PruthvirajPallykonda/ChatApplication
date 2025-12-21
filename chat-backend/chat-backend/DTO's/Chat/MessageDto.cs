namespace chat_backend.DTO_s.Chat
{
    public class MessageDto
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public int SenderId { get; set; }
        public string SenderName { get; set; } = default!;
        public string Text { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }
        public string Status { get; set; } = "sent";

        public List<MessageReactionDto> Reactions { get; set; } = new();

        public string? FileUrl { get; set; }
        public string? FileName { get; set; }
        public string? FileType { get; set; }

    }
}
