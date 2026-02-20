using chat_backend.DTO_s.Auth;
using chat_backend.Entities;

namespace chat_backend.Services.Interfaces
{
    public interface IAuthService
    {
        Task<User> RegisterAsync(RegisterRequest request);
        Task<LoginResponse> LoginAsync(LoginRequest request);

    }
}
