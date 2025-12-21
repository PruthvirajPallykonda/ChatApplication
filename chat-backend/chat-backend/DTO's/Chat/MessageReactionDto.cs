// DTO_s/Chat/MessageReactionDto.cs
namespace chat_backend.DTO_s.Chat
{
    public class MessageReactionDto
    {
        public int Id { get; set; }
        public int MessageId { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Emoji { get; set; } = string.Empty;
    }
}
