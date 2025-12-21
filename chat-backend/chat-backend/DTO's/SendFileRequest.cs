// DTOs/Chat/SendFileRequest.cs
namespace chat_backend.DTO_s.Chat
{
    public class SendFileRequest
    {
        public int RoomId { get; set; }
        public int SenderId { get; set; }
        public IFormFile File { get; set; } = default!;
    }
}
