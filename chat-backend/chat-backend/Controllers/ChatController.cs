using chat_backend.Data;
using chat_backend.DTO_s.Chat;
using chat_backend.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace chat_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ChatController(AppDbContext context)
        {
            _context = context;
        }

        // GET: /api/chat/getall/chatrooms
        [HttpGet("getall/chatrooms")]
        public async Task<ActionResult<IEnumerable<ChatRoomDto>>> GetAllChatRooms()
        {
            var rooms = await _context.ChatRooms
                .Select(r => new ChatRoomDto
                {
                    Id = r.Id,
                    User1Id = r.User1Id,
                    User2Id = r.User2Id
                })
                .ToListAsync();

            return Ok(rooms);
        }

        // GET: /api/chat/get/messages/usingroomid/{roomId}
        [HttpGet("get/messages/usingroomid/{roomId:int}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessages(int roomId)
        {
            var messages = await _context.Messages
                .Where(m => m.RoomId == roomId)
                .OrderBy(m => m.SentAt)
                .Select(m => new MessageDto
                {
                    Id = m.Id,
                    RoomId = m.RoomId,
                    SenderId = m.SenderId,
                    Text = m.Text,
                    SentAt = m.SentAt
                })
                .ToListAsync();

            return Ok(messages);
        }

        // POST: /api/chat/creatingchatroom
        [HttpPost("creatingchatroom")]
        public async Task<IActionResult> CreateChatRoom([FromBody] CreateChatRoomRequest request)
        {
            // prevent duplicate rooms for same pair
            var existing = await _context.ChatRooms
                .FirstOrDefaultAsync(r =>
                    (r.User1Id == request.User1Id && r.User2Id == request.User2Id) ||
                    (r.User1Id == request.User2Id && r.User2Id == request.User1Id));

            if (existing != null)
            {
                return Ok(new { roomId = existing.Id });
            }

            var room = new ChatRoom
            {
                User1Id = request.User1Id,
                User2Id = request.User2Id
            };

            _context.ChatRooms.Add(room);
            await _context.SaveChangesAsync();

            return Ok(new { roomId = room.Id });
        }

        // POST: /api/chat/sendmessage
        [HttpPost("sendmessage")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
        {
            var message = new Message
            {
                RoomId = request.RoomId,
                SenderId = request.SenderId,
                Text = request.Text,
                SentAt = DateTime.UtcNow
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(new { message.Id });
        }
    }
}
