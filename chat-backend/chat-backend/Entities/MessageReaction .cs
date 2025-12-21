// Entities/MessageReaction.cs
namespace chat_backend.Entities
{
    public class MessageReaction
    {
        public int Id { get; set; }

        public int MessageId { get; set; }
        public Message Message { get; set; } = null!;

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        // store emoji as short code or actual unicode, e.g. "👍" or ":thumbsup:"
        public string Emoji { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
