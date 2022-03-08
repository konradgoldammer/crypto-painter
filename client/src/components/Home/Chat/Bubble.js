import React from "react";
import PropTypes from "prop-types";

const Bubble = ({ message }) => {
  return <div className="m-1">{message.content}</div>;
};

Bubble.propTypes = {
  message: PropTypes.object.isRequired,
};

export default Bubble;
