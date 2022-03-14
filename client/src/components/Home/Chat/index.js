import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import loading from "../../../assets/loading.gif";
import Bubble from "./Bubble";
import Info from "./Info";

const Chat = ({ socket, setAlert, setShowAlert, token }) => {
  const scrollEl = useRef(null);
  const inputEl = useRef(null);

  const [paintersOnline, setPaintersOnline] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isWaitingForServer, setIsWaitingForServer] = useState(false);
  const [messages, setMessages] = useState([]);

  const newBubble = (message) => (
    <Bubble
      key={message.timestamp}
      message={message}
      setAlert={setAlert}
      setShowAlert={setShowAlert}
    />
  );

  useEffect(() => {
    socket.on("disconnect", () => {
      setIsLoading(true);
    });

    socket.on("connect", () => {
      setIsLoading(false);
    });

    socket.on("painters_online", (paintersOnline) => {
      setPaintersOnline(paintersOnline);
    });

    socket.emit("chat", (info) => {
      setMessages([<Info key={Date.now()} info={info} />]);
      setIsLoading(false);
    });
  }, [socket]);

  useEffect(() => {
    socket.removeListener("message");

    socket.on("message", (message) => {
      const isDown =
        Math.abs(
          Math.round(scrollEl.current.scrollTop) -
            (scrollEl.current.scrollHeight - 541) // Adjust to height of chat yo
        ) <= 50;

      setMessages([...messages, newBubble(message)]);

      if (isDown) {
        scrollEl.current.scrollTop = scrollEl.current.scrollHeight;
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, messages]);

  const inputKeyDown = async (e) => {
    if (e.keyCode === 13 && e.target.value) {
      setIsWaitingForServer(true);

      socket.emit(
        "message",
        { content: e.target.value, token },
        (error, message) => {
          if (error) {
            setAlert(error);
            setShowAlert(true);
          }

          setIsWaitingForServer(false);

          if (message) {
            setMessages([...messages, newBubble(message)]);
            e.target.value = "";
            scrollEl.current.scrollTop = scrollEl.current.scrollHeight;
            inputEl.current.focus();
          }
        }
      );
    }
  };

  return (
    <div className="chat-container bg-secondary ms-2 rounded text-light">
      <div className="chat-header d-flex justify-content-between p-1 pb-0">
        <p className="m-0">Chat</p>
        <p className="m-0">{paintersOnline} online</p>
      </div>
      <div className="chat-body border border-secondary border-4 rounded-bottom">
        <div className="chat-area bg-dark rounded-top">
          <div
            className="scrollbar scrollbar-primary h-100 py-1 position-relative"
            ref={scrollEl}
          >
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
          onKeyDown={
            token
              ? inputKeyDown
              : (e) => {
                  e.preventDefault();
                  setAlert(
                    "You need to connect your wallet before you can send messages"
                  );
                  setShowAlert(true);
                }
          }
          disabled={isLoading || isWaitingForServer}
          maxLength={100}
          ref={inputEl}
        />
      </div>
    </div>
  );
};

Chat.propTypes = {
  socket: PropTypes.object.isRequired,
  setAlert: PropTypes.func.isRequired,
  setShowAlert: PropTypes.func.isRequired,
  token: PropTypes.string,
};

export default Chat;
