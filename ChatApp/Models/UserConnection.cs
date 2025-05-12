namespace ChatApp.Models
{
    public class UserConnection
    {
        required
        public string UserName { get; set; } = string.Empty;
        required
        public string ChatRoom { get; set; } = string.Empty;
    }
}
