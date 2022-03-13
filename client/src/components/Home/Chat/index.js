import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import loading from "../../../assets/loading.gif";
import Bubble from "./Bubble";
import Info from "./Info";

const Chat = ({ socket }) => {
  const [paintersOnline, setPaintersOnline] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitingForServer, setIsWaitingForServer] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Load chat
    socket.emit("chat", (info) => {
      setMessages([...messages, <Info info={info} />]);
      setIsLoading(false);
    });

    // Get messges
    socket.on("message", (message) => {
      setMessages([...messages, <Bubble message={message} />]);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return (
    <div className="chat-container bg-secondary ms-2 rounded text-light">
      <div className="chat-header d-flex justify-content-between p-1 pb-0">
        <p className="m-0">Chat</p>
        <p className="m-0">{paintersOnline} online</p>
      </div>
      <div className="chat-body border border-secondary border-4 rounded-bottom">
        <div className="chat-area bg-dark rounded-top">
          <div className="scrollbar scrollbar-primary h-100 py-1 position-relative">
            {!isLoading ? (
              messages.map((message) => message)
            ) : (
              <img
                src={loading}
                alt="connecting..."
                title="connecting..."
                className="loading center"
              />
            )}
          </div>
        </div>
        <input
          className="chat-input bg-dark border-top border-secondary border-2 text-light rounded-bottom w-100 px-1 py-0"
          type="text"
          placeholder="Send a message"
          onKeyDown={async (e) => {
            if (e.keyCode === 13) {
              setIsWaitingForServer(true);
            }
          }}
          disabled={isLoading || isWaitingForServer}
        />
      </div>
    </div>
  );
};

Chat.propTypes = {
  socket: PropTypes.object.isRequired,
};

export default Chat;
