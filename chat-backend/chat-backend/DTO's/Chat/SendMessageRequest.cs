namespace chat_backend.DTO_s.Chat
{
    public class SendMessageRequest
    {
        public int RoomId { get; set; }
        public int SenderId { get; set; }
        public string Text { get; set; } = string.Empty;
    }
}
