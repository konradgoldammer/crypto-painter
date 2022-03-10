import React, { useState } from "react";
import PropTypes from "prop-types";
import Bubble from "./Bubble";

const Chat = () => {
  const [messages, setMessages] = useState([1, 2]);

  return (
    <div className="chat-container bg-secondary ms-3 rounded text-light border border-secondary border-4 border-bottom-0 h-auto">
      <div className="chat-header d-flex justify-content-between ">
        <p className="m-0">Chat</p>
        <p className="m-0">5 online</p>
      </div>
      <div className="" style={{ height: "576px" }}>
        <div className="chat-area bg-dark rounded-top mt-1">
          <div className="scrollbar scrollbar-primary h-100">
            {messages.map((message) => (
              <Bubble message={{ content: "sdfjkldsfj" }} />
            ))}
          </div>
          <input
            className="chat-input bg-dark border-top border-secondary border-1 text-light rounded-bottom w-100 px-1"
            type="text"
            placeholder="Send a message"
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
