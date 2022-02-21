import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import MainNavbar from "../shared/MainNavbar";
import Alert from "../shared/Alert";
import Menu from "./Menu";

const Home = ({ title, account, setAccount }) => {
  useEffect(() => {
    // Set page title
    document.title = title;
  }, [title]);

  const [alert, setAlert] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(5);
  const [lineColor, setLineColor] = useState("black");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = "1";
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctxRef.current = ctx;
  }, [lineColor, lineWidth]);

  // Function for starting the drawing
  const startDrawing = (e) => {
    console.log("Start drawing");
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  // Function for ending the drawing
  const endDrawing = () => {
    console.log("End drawing");
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing) {
      return;
    }
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

    ctxRef.current.stroke();
  };

  const showNotAllowedAlert = () => {
    setAlert("You need to connect your wallet before you can draw 🤬");
    setShowAlert(true);
  };

  return (
    <div>
      <MainNavbar
        account={account}
        setAccount={setAccount}
        setAlert={setAlert}
        setShowAlert={setShowAlert}
      />
      <Alert
        content={alert}
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        setAlert={setAlert}
      />
      <div className="draw-container mx-auto">
        <Menu setLineColor={setLineColor} setLineWidth={setLineWidth} />
        <canvas
          onMouseDown={account ? startDrawing : showNotAllowedAlert}
          onMouseUp={account ? endDrawing : null}
          onMouseMove={account ? draw : null}
          ref={canvasRef}
          width={`720px`}
          height={`576px`}
          className="draw-area bg-white border border-secondary border-3"
        />
      </div>
    </div>
  );
};

Home.propTypes = {
  title: PropTypes.string,
  account: PropTypes.string,
  setAccount: PropTypes.func,
};

export default Home;
