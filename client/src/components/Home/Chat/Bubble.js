import React from "react";
import PropTypes from "prop-types";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

const Bubble = ({ message, setShowAlert, setAlert }) => {
  const copyToClipboard = (string) => {
    navigator.clipboard.writeText(string);
  };

  return (
    <p className="m-0 p-1 position-relative" style={{ wordWrap: "break-word" }}>
      <span className="text-secondary">
        {new Date(message.timestamp).toLocaleTimeString(navigator.language, {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
      <div
        className="d-inline position-absolute bubble-icon ms-1"
        style={{ height: "20px" }}
        title={message.address}
        onClick={() => {
          copyToClipboard(message.address);
          setAlert("Copied address to clipboard ✅");
          setShowAlert(true);
        }}
      >
        <Jazzicon diameter={20} seed={jsNumberForAddress(message.address)} />
      </div>
      <span className="d-inline-block" style={{ width: "27px" }} />:{" "}
      {message.content}
    </p>
  );
};

Bubble.propTypes = {
  message: PropTypes.object.isRequired,
  setShowAlert: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};

export default Bubble;
