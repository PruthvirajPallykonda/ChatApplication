using chat_backend.Data;
using chat_backend.DTO_s.Chat;
using chat_backend.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

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
                .Include(r => r.User1)
                .Include(r => r.User2)
                .Select(r => new ChatRoomDto
                {
                    Id = r.Id,
                    User1Id = r.User1Id,
                    User2Id = r.User2Id,
                    User1Name = r.User1.Username,
                    User2Name = r.User2.Username,
                    Name = r.Name
                })
                .ToListAsync();

            return Ok(rooms);
        }

        // GET: /api/chat/get/messages/usingroomid/{roomId}
        [HttpGet("get/messages/usingroomid/{roomId:int}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessages(int roomId)
        {
            var messages = await _context.Messages
                .Include(m => m.Sender)
                .Include(m => m.Reactions)
                    .ThenInclude(r => r.User)
                .Where(m => m.RoomId == roomId)
                .OrderBy(m => m.SentAt)
                .Select(m => new MessageDto
                {
                    Id = m.Id,
                    RoomId = m.RoomId,
                    SenderId = m.SenderId,
                    SenderName = m.Sender.Username,
                    Text = m.Text,
                    SentAt = m.SentAt,
                    Status = m.Status,
                    FileUrl = m.FileUrl,
                    FileName = m.FileName,
                    FileType = m.FileType,
                    Reactions = m.Reactions
                        .Select(r => new MessageReactionDto
                        {
                            Id = r.Id,
                            MessageId = r.MessageId,
                            UserId = r.UserId,
                            Username = r.User.Username,
                            Emoji = r.Emoji
                        })
                        .ToList()
                })
                .ToListAsync();

            return Ok(messages);
        }

        // POST: /api/chat/creatingchatroom
        [HttpPost("creatingchatroom")]
        public async Task<IActionResult> CreateChatRoom([FromBody] CreateChatRoomRequest request)
        {
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
                SentAt = DateTime.UtcNow,
                Status = "sent"
            };

            _context.Messages.Add(message);

            // temporary: mark delivered
            message.Status = "delivered";

            await _context.SaveChangesAsync();

            return Ok(new { message.Id });
        }

        [HttpPut("{roomId:int}/name")]
        public async Task<IActionResult> UpdateRoomName(int roomId, [FromBody] UpdateRoomNameRequest request)
        {
            var room = await _context.ChatRooms.FindAsync(roomId);
            if (room == null) return NotFound();

            room.Name = string.IsNullOrWhiteSpace(request.Name)
                ? null
                : request.Name.Trim();

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return null;
            if (int.TryParse(userIdClaim.Value, out var id)) return id;
            return null;
        }

        // PUT: /api/chat/messages/{id}
        // Only last own message in room, within 5 minutes
        [HttpPut("messages/{id:int}")]
        public async Task<IActionResult> UpdateMessage(int id, [FromBody] UpdateMessageRequest request)
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId == null) return Unauthorized();

            var message = await _context.Messages.FindAsync(id);
            if (message == null) return NotFound();

            if (message.SenderId != currentUserId.Value)
                return Forbid();

            var lastMyMessage = await _context.Messages
                .Where(m => m.RoomId == message.RoomId && m.SenderId == currentUserId.Value)
                .OrderByDescending(m => m.SentAt)
                .FirstOrDefaultAsync();

            if (lastMyMessage == null || lastMyMessage.Id != message.Id)
                return BadRequest("Only the last message can be edited.");

            var diff = DateTime.UtcNow - message.SentAt;
            if (diff > TimeSpan.FromMinutes(5))
                return BadRequest("Edit window (5 minutes) has expired.");

            message.Text = request.Text;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: /api/chat/messages/{id}
        [HttpDelete("messages/{id:int}")]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId == null) return Unauthorized();

            var message = await _context.Messages.FindAsync(id);
            if (message == null) return NotFound();

            if (message.SenderId != currentUserId.Value)
                return Forbid();

            _context.Messages.Remove(message);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("sendfile")]
        [AllowAnonymous]
        [RequestSizeLimit(10_000_000)] // 10 MB
        public async Task<IActionResult> SendFile([FromForm] SendFileRequest request)
        {
            if (request.File == null || request.File.Length == 0)
                return BadRequest("File is required.");

            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(uploadsPath))
                Directory.CreateDirectory(uploadsPath);

            var uniqueName = $"{Guid.NewGuid()}_{request.File.FileName}";
            var filePath = Path.Combine(uploadsPath, uniqueName);

            await using (var stream = System.IO.File.Create(filePath))
            {
                await request.File.CopyToAsync(stream);
            }

            var relativeUrl = $"/uploads/{uniqueName}";

            var message = new Message
            {
                RoomId = request.RoomId,
                SenderId = request.SenderId,
                Text = string.Empty,
                SentAt = DateTime.UtcNow,
                Status = "sent",
                FileUrl = relativeUrl,
                FileName = request.File.FileName,
                FileType = request.File.ContentType
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(new { message.Id, message.FileUrl, message.FileName, message.FileType });
        }

        // GET: /api/chat/contacts
        [HttpGet("contacts")]
        public async Task<ActionResult<IEnumerable<object>>> GetMyContacts()
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId == null) return Unauthorized();

            var contacts = await _context.ChatRooms
                .Where(r => r.User1Id == currentUserId || r.User2Id == currentUserId)
                .Select(r => new
                {
                    RoomId = r.Id,
                    ContactId = r.User1Id == currentUserId ? r.User2Id : r.User1Id,
                    ContactName = r.User1Id == currentUserId
                        ? r.User2.Username
                        : r.User1.Username
                })
                .Distinct()
                .ToListAsync();

            return Ok(contacts);
        }

        // POST: /api/chat/messages/{id}/react
        [HttpPost("messages/{id:int}/react")]
        public async Task<IActionResult> AddReaction(int id, [FromBody] AddReactionRequest request)
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId == null) return Unauthorized();

            var message = await _context.Messages.FindAsync(id);
            if (message == null) return NotFound();

            var emoji = (request.Emoji ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(emoji))
                return BadRequest("Emoji is required.");

            var existing = await _context.MessageReactions
                .FirstOrDefaultAsync(r =>
                    r.MessageId == id &&
                    r.UserId == currentUserId.Value &&
                    r.Emoji == emoji);

            if (existing != null)
            {
                _context.MessageReactions.Remove(existing);
                await _context.SaveChangesAsync();
                return NoContent();
            }

            var reaction = new MessageReaction
            {
                MessageId = id,
                UserId = currentUserId.Value,
                Emoji = emoji,
                CreatedAt = DateTime.UtcNow
            };

            _context.MessageReactions.Add(reaction);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                reaction.Id,
                reaction.MessageId,
                reaction.UserId,
                reaction.Emoji
            });
        }

        // DELETE: /api/chat/messages/{id}/react/{reactionId}
        [HttpDelete("messages/{id:int}/react/{reactionId:int}")]
        public async Task<IActionResult> RemoveReaction(int id, int reactionId)
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId == null) return Unauthorized();

            var reaction = await _context.MessageReactions
                .FirstOrDefaultAsync(r => r.Id == reactionId && r.MessageId == id);

            if (reaction == null) return NotFound();

            if (reaction.UserId != currentUserId.Value)
                return Forbid();

            _context.MessageReactions.Remove(reaction);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
