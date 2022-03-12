import React, { useState } from "react";
import PropTypes from "prop-types";
import Bubble from "./Bubble";
import Info from "./Info";

const Chat = ({ setShowAlert, setAlert }) => {
  const [paintersOnline, setPaintersOnline] = useState(0);
  const [messages, setMessages] = useState([1, 2]);

  return (
    <div className="chat-container bg-secondary ms-2 rounded text-light">
      <div className="chat-header d-flex justify-content-between p-1 pb-0">
        <p className="m-0">Chat</p>
        <p className="m-0">{paintersOnline} online</p>
      </div>
      <div className="chat-body border border-secondary border-4 rounded-bottom">
        <div className="chat-area bg-dark rounded-top">
          <div className="scrollbar scrollbar-primary h-100 py-1">
            <Info info={{ content: "Connected" }} />
            {messages.map((message) => (
              <Bubble
                message={{
                  content:
                    "ja jetzt kommt sjdfalkjasdflsjmdfvklvdmnafsjmvsdfakjlamaj und ja",
                  address: "0x6415ed9272bE40dAFb0bbA01ab4cB31A93a6f5d9",
                  timestamp: new Date(),
                }}
                setShowAlert={setShowAlert}
                setAlert={setAlert}
              />
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

Chat.propTypes = {
  setShowAlert: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};

export default Chat;
