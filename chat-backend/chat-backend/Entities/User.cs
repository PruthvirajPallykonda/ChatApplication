namespace chat_backend.Entities
{
    public class User
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string PasswordSalt { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        //navigation
        public ICollection<Message> Messages { get; set; } = new List<Message>();
        public ICollection<ChatRoom> ChatRoomsAsUser1 { get; set; } = new List<ChatRoom>();
        public ICollection<ChatRoom> ChatRoomsAsUser2 { get; set; } = new List<ChatRoom>();

        
    }
}
