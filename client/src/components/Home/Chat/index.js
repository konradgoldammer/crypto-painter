import React, { useState } from "react";
import PropTypes from "prop-types";
import Bubble from "./Bubble";

const Chat = () => {
  const [messages, setMessages] = useState([
    1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2,
    3, 2, 3, 2, 3, 2, 3,
  ]);

  return (
    <div className="chat-container bg-secondary ms-2 rounded text-light">
      <div className="chat-header d-flex justify-content-between p-1 pb-0">
        <p className="m-0">Chat</p>
        <p className="m-0">5 online</p>
      </div>
      <div className="chat-body border border-secondary border-4 rounded-bottom bg-primary">
        <div className="chat-area bg-dark rounded-top">
          <div className="scrollbar scrollbar-primary h-100">
            {messages.map((message) => (
              <Bubble message={{ content: "sdfjkldsfj" }} />
            ))}
          </div>
        </div>
        <input
          className="chat-input bg-dark border-top border-secondary border-2 text-light rounded-bottom w-100 px-1 py-0"
          type="text"
          placeholder="Send a message"
        />
      </div>
    </div>
  );
};

export default Chat;
