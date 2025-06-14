import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiSend } from 'react-icons/fi';

const ChatBox = ({ sendMessage }) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim()) {
            sendMessage(message);
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chatbox-container">
            <div className="chatbox-inner">
                <textarea
                    className="chatbox-textarea"
                    rows="1"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                />
                <button className="chatbox-button" onClick={handleSend}>
                    <FiSend />
                </button>
            </div>
        </div>
    );
};

ChatBox.propTypes = {
    sendMessage: PropTypes.func.isRequired
};

export default ChatBox;