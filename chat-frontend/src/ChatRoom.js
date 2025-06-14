import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const ChatRoom = ({ title, usermessages }) => {
    const messagesEndRef = useRef(null);
    const maxMessages = 100; // Limit to the last 100 messages
    usermessages = usermessages.slice(-maxMessages); // Limit to the last 100 messages

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [usermessages]);

    return (
        <div className="chat-room">
            <h3 className="chat-title">{title}</h3>
            <div className="chat-messages">
                {usermessages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.isSystem ? 'system-message' : 'user-message'}`}>
                        <strong>{msg.user}: </strong>{msg.message}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

ChatRoom.propTypes = {
    title: PropTypes.string.isRequired,
    usermessages: PropTypes.arrayOf(
        PropTypes.shape({
            user: PropTypes.string.isRequired,
            message: PropTypes.string.isRequired
        })
    ).isRequired
};

export default ChatRoom;