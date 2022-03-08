import React, { useState } from "react";
import PropTypes from "prop-types";
import Bubble from "./Bubble";

const Chat = () => {
  const [messages, setMessages] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 2, 3, 2, 2, 2, 2, 2,
  ]);

  return (
    <div className="chat-container bg-secondary ms-2 rounded text-light border border-secondary border-3 border-bottom-0 h-auto">
      <div className="chat-header m-1 d-flex justify-content-between">
        <h5 className="m-0">Chat</h5>
        <p className="m-0">5 online</p>
      </div>
      <div className="" style={{ height: "576px" }}>
        <div className="chat-area bg-dark rounded-top mt-2">
          <div className="scrollbar scrollbar-primary h-100">
            {messages.map((message) => (
              <Bubble message={{ content: "sdfjkldsfj" }} />
            ))}
          </div>
          <input
            className="chat-input bg-dark border-top border-secondary border-3 text-light rounded-bottom w-100 px-1"
            type="text"
            placeholder="Send a message"
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
