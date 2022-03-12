import React from "react";
import PropTypes from "prop-types";

const Info = ({ info }) => {
  return (
    <div className="text-secondary text-center m-0 p-1">{info.content}</div>
  );
};

Info.propTypes = {
  info: PropTypes.object.isRequired,
};

export default Info;
