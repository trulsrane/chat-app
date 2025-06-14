import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import ChatRoom from './ChatRoom';
import ChatBox from './ChatBox';

const ChatHome = () => {
    const [connection, setConnection] = useState(null);
    const [usermessages, setUserMessages] = useState([]);
    const [userName, setUserName] = useState('');
    const [chatRoom, setChatRoom] = useState('');
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('Student');
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        if (connection) {
            connection.on("ReceiveMessage", (user, message, room) => {
                if (room.endsWith("_Announcements")) {
                    setAnnouncements(prev => ({
                        ...prev,
                        [room]: [...(prev[room] || []), { user, message }]
                    }));
                } else {
                    setUserMessages(prev => ({
                        ...prev,
                        [room]: [...(prev[room] || []), { user, message }]
                    }));
                }
            });

            connection.onclose(() => {
                console.log("Connection closed");
            });
        }
    }, [connection]);

    const joinChatRoom = async (userName, chatRoom) => {
        try {
        setLoading(true);
        console.log("Connecting to SignalR hub at: http://localhost:7142/chat");
        const connection = new HubConnectionBuilder()
            .withUrl("http://localhost:7142/chat")//replce your backend Url
            .configureLogging(LogLevel.Information)
            .build();

    console.log("Försöker starta SignalR-anslutning...");
    await connection.start()
        .then(() => console.log("Anslutning klar!"))
        .catch(err => {
            console.error("Connection error:", err);
    });
    console.log("Efter start()");
        await connection.invoke("JoinChatRoom", userName, role, chatRoom);
        setConnection(connection);
        setLoading(false);
        } catch (error) {
            console.error("Error joining chat room:", error);
        }finally {
            setLoading(false);
        }
    };

    const sendMessage = async (room, message) => {
        if (connection) {
            await connection.invoke("SendMessage", room, userName, role, message);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900">
            <main className="flex-grow mx-auto px-4">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-white">Connecting to chat room...</p>
                    </div>
                ) : (
                    connection ? (
                            <>
                                <div className="chat-box">
                                <div className="chat-container">
                                    <div className="chat-room">
                                        <ChatRoom
                                            title={`Chat: ${chatRoom}`}
                                            usermessages={usermessages[chatRoom] || []}
                                            />
                                        </div>
                                        {(role === "Teacher" || !chatRoom.endsWith("_Announcements")) && (
                                            <ChatBox sendMessage={(msg) => sendMessage(chatRoom, msg)} />
                                        )}
                                    </div>
                                    <div className="chat-container">
                                    <div className="chat-room">
                                        <ChatRoom
                                            title={`Announcements for ${chatRoom}`}
                                            usermessages={announcements[`${chatRoom}_Announcements`] || []}
                                        />
                                        </div>
                                        {role === "Teacher" && (
                                            <ChatBox sendMessage={(msg) => sendMessage(`${chatRoom}_Announcements`, msg)} />
                                        )}
                                </div>
                                </div>
                        </>
                    ) : (
                                <div className="login-wrapper">
                                    <div className="login-container">
                                        <h2 className="login-title">Join a Chat Room</h2>
                                        <select
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="login-input"
                                        >
                                            <option value="Student">Student</option>
                                            <option value="Teacher">Teacher</option>
                                        </select>

                                        <input
                                            type="text"
                                            placeholder="Enter your name"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                            className="login-input"
                                        />

                                        <input
                                            type="text"
                                            placeholder="Enter chat room name"
                                            value={chatRoom}
                                            onChange={(e) => setChatRoom(e.target.value)}
                                            className="login-input"
                                        />

                                        <button onClick={() => joinChatRoom(userName, chatRoom)} className="login-button">
                                            Join Chat Room
                                        </button>
                                    </div>
                                </div>
                    )
                )}
            </main>
        </div>
    );
};

export default ChatHome;