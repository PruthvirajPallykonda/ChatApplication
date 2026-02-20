namespace chat_backend.Entities
{
    public class ChatRoom
    {
        public int Id { get; set; }
        public int User1Id { get; set; }
        public int User2Id { get; set; }

        public string? Name { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public User? User1 { get; set; }
        public User? User2 { get; set; } 
        public ICollection<Message> Messages { get; set; } = new List<Message>();
    }
}
