import React from "react";
import PropTypes from "prop-types";

const Menu = ({ setLineColor, setLineWidth }) => {
  return (
    <div
      className="bg-secondary d-flex p-1 pb-0 rounded-top text-light"
      style={{ width: "fit-content" }}
    >
      <label className="me-2">Brush Color</label>
      <input
        className="me-3 rounded"
        type="color"
        onChange={(e) => {
          setLineColor(e.target.value);
        }}
      />
      <label className="me-2">Brush Width</label>
      <input
        className="slider bg-light rounded"
        type="range"
        min="3"
        max="20"
        defaultValue="5"
        onChange={(e) => {
          setLineWidth(Number(e.target.value));
        }}
      />
    </div>
  );
};

Menu.propTypes = {
  setLineColor: PropTypes.func.isRequired,
  setLineWidth: PropTypes.func.isRequired,
};

export default Menu;
