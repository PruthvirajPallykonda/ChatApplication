namespace chat_backend.DTO_s.Auth
{
    public class RegisterRequest
    {
        public string PhoneNumber { get; set; } = string.Empty; 
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
