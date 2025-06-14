using ChatApp.DataService;
using ChatApp.Models;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace ChatApp.Hubs
{
    public class ChatHub : Hub
    {
        private readonly SharedDb _sharedDb;

        public ChatHub(SharedDb sharedDb)
        {
            _sharedDb = sharedDb;
        }

        public async Task JoinChatRoom(string userName, string role, string chatRoom)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, chatRoom);
            _sharedDb.Connection[Context.ConnectionId] = new UserConnection { UserName = userName, ChatRoom = chatRoom };
            await Groups.AddToGroupAsync(Context.ConnectionId, $"{chatRoom}_Announcements");
            _sharedDb.Connection[Context.ConnectionId] = new UserConnection { UserName = userName, ChatRoom = chatRoom };

            await Clients.Group(chatRoom).SendAsync("ReceiveMessage", "System", $"{userName} ({role}) has joined the chat room {chatRoom}");
            await Clients.Group($"{chatRoom}_Announcements").SendAsync("ReceiveMessage", "System", $"{userName} ({role}) has joined announcements.");
        }

        public async Task SendMessage(string chatRoom, string user, string role, string message)
        {
            if (chatRoom == "Announcements" && role != "Teacher")
            {
                await Clients.Caller.SendAsync("ReceiveMessage", "System", "Only teachers can send messages in the announcement channel.", chatRoom);
                return;
            }

            await Clients.Group(chatRoom).SendAsync("ReceiveMessage", $"{user} ({role})", message, chatRoom);
        }
    }
}