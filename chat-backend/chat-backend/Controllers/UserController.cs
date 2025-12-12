using chat_backend.Data;
using chat_backend.DTO_s.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace chat_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {

        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("getallusers")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new UserDto
                {
                    UserId = u.UserId,
                    Username = u.Username,
                    PhoneNumber = u.PhoneNumber
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<UserDto>>> SearchUsers([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Ok(Array.Empty<UserDto>());

            query = query.Trim().ToLower();

            var users = await _context.Users
                .Where(u =>
                    u.Username.ToLower().Contains(query) ||
                    u.PhoneNumber.Contains(query))
                .Select(u => new UserDto
                {
                    UserId = u.UserId,
                    Username = u.Username,
                    PhoneNumber = u.PhoneNumber
                })
                .ToListAsync();

            return Ok(users);
        }
    }
}
