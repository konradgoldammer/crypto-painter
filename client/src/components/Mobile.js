import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import logo from "../assets/web-design-brush.png";
import example from "../assets/example.png";
import MainFooter from "./shared/MainFooter";

const Mobile = ({ setRenderDesktop, socket }) => {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    // Get img src
    socket.emit("mobile", (src) => {
      console.log("afterit");
      setSrc(src);
    });
  }, [socket]);

  return (
    <div className="mobile px-3 text-light text-center">
      <p className="brand mobile-brand text-center mb-3">
        <img src={logo} alt="Crypto-Painter" className="logo me-1" />
        CRYPTO-PAINTER
      </p>
      <img
        className="mobile-image mb-3 border border-secondary border-2"
        src={`'${src}'`}
        alt=""
      />
      <p className="text-start">
        This content is unavailabe on mobile. Check out @crypt0painter on
        Twitter if want to see the latest NFTs and winners.
      </p>
      <button
        className="btn btn-secondary"
        onClick={() => setRenderDesktop(true)}
      >
        Render Desktop Version
      </button>
      <MainFooter />
    </div>
  );
};

Mobile.propTypes = {
  setRenderDesktop: PropTypes.func.isRequired,
  socket: PropTypes.object.isRequired,
};

export default Mobile;
