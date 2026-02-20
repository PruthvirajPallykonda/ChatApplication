namespace chat_backend.DTO_s.Chat
{
    public class ChatRoomDto
    {
        public int Id { get; set; }
        public int User1Id { get; set; }
        public int User2Id { get; set; }

        public string User1Name { get; set; } = default!;
        public string User2Name { get; set; } = default!;

        public string? Name { get; set; }
    }
}
