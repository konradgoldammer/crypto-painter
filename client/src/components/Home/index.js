import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import MainNavbar from "../shared/MainNavbar";
import MainFooter from "../shared/MainFooter";
import Alert from "../shared/Alert";
import loading from "../../assets/loading.gif";
import Menu from "./Menu";
import Web3Token from "web3-token";

const Home = ({ title, account, setAccount, token, setToken, socket }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [alert, setAlert] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isUpdatingCanvas, setIsUpdatingCanvas] = useState(true);
  const [isWaitingForServer, setIsWaitingForServer] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(5);
  const [lineColor, setLineColor] = useState("#000000"); // black
  const [currentStroke, setCurrentStroke] = useState(null);

  useEffect(() => {
    // Set page title
    document.title = title;
  }, [title]);

  useEffect(() => {
    // Get image obj
    socket.emit("image", (image) => {
      console.log("Loading image...");
      image.strokes.forEach((stroke) => drawStroke(stroke));
      setIsUpdatingCanvas(false);
    });

    // Wait for reset
    socket.on("reset", () => {
      console.log("RESET!");

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, 720, 576);
      ctxRef.current = ctx;

      setAlert(
        "Time's up! The Canvas has been reset. The created image has been raffled off as an NFT to a random contributor. 🥳"
      );
      setShowAlert(true);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    // Remove old listener
    socket.removeListener("stroke");

    // Wait for new strokes from others
    socket.on("stroke", (stroke) => {
      console.log("New other stroke");
      drawStroke(stroke);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineWidth, lineColor, socket]);

  useEffect(() => {
    if (socket) {
      socket.emit("login", account, (nft) => {
        if (nft) {
          setAlert(
            `Congrats you are the winner of the latest Crypto-Painting (URL: ${nft.urlImage}, Token-ID: ${nft.tokenId}). We transferred the NFT to your wallet (transaction hash: ${nft.transaction}) 🥳`
          );
          setShowAlert(true);
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const resetCanvasStyle = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = "1";
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctxRef.current = ctx;
  };

  useEffect(() => {
    resetCanvasStyle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineColor, lineWidth]);

  // Function for starting the drawing
  const startDrawing = (e) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);

    setCurrentStroke({
      token,
      color: lineColor,
      size: lineWidth,
      points: [{ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }],
    });
  };

  // Function for ending the drawing
  const endDrawing = () => {
    if (!isDrawing) {
      return;
    }

    ctxRef.current.closePath();
    setIsDrawing(false);

    // Send stroke to server socket
    setIsWaitingForServer(true);
    socket.emit("stroke", currentStroke, (error) => {
      if (error) {
        setAlert(error);
        setShowAlert(true);
      }

      setIsWaitingForServer(false);
    });
  };

  const draw = (e) => {
    if (!isDrawing) {
      return;
    }

    if (currentStroke.points.length >= 200) {
      endDrawing();
      return;
    }

    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

    ctxRef.current.stroke();

    setCurrentStroke({
      ...currentStroke,
      points: [
        ...currentStroke.points,
        { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY },
      ],
    });
  };

  const drawStroke = (stroke) => {
    // Configure style
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.size;
    ctxRef.current = ctx;

    // Draw
    ctxRef.current.beginPath();
    stroke.points.forEach((point, index) => {
      if (index === 0) {
        ctxRef.current.moveTo(point.x, point.y);
        return;
      }
      ctxRef.current.lineTo(point.x, point.y);
      ctxRef.current.stroke();
    });
    ctxRef.current.closePath();

    // Reset style
    resetCanvasStyle();
  };

  const showNotAllowedAlert = () => {
    if (isUpdatingCanvas || isWaitingForServer) {
      return;
    }

    let alertMsg;

    if (!account) {
      alertMsg = "You need to connect your wallet before you can draw 🤬";
      setAlert(alertMsg);
      setShowAlert(true);
      return;
    }

    Web3Token.sign((msg) => window.web3.eth.personal.sign(msg, account, ""))
      .then((token) => {
        setToken(token);
        localStorage.setItem("token", token);
      })
      .catch(() => {});
  };

  return (
    <div>
      <MainNavbar
        account={account}
        setAccount={setAccount}
        setAlert={setAlert}
        setShowAlert={setShowAlert}
        setToken={setToken}
      />
      <Alert
        content={alert}
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        setAlert={setAlert}
      />
      <div className="draw-container mx-auto mt-3">
        <Menu setLineColor={setLineColor} setLineWidth={setLineWidth} />
        <div className="position-relative">
          <canvas
            onMouseDown={
              token && !isUpdatingCanvas ? startDrawing : showNotAllowedAlert
            }
            onMouseUp={
              token && !isUpdatingCanvas && !isWaitingForServer
                ? endDrawing
                : null
            }
            onMouseMove={
              token && !isUpdatingCanvas && !isWaitingForServer ? draw : null
            }
            onMouseOut={
              token && !isUpdatingCanvas && !isWaitingForServer
                ? endDrawing
                : null
            }
            ref={canvasRef}
            width={`720px`}
            height={`576px`}
            className="draw-area bg-white border border-secondary border-3"
          />
          {isUpdatingCanvas && (
            <img
              src={loading}
              alt="connecting..."
              title="connecting..."
              className="loading center"
            />
          )}
        </div>
      </div>
      <MainFooter />
    </div>
  );
};

Home.propTypes = {
  title: PropTypes.string,
  account: PropTypes.string,
  setAccount: PropTypes.func.isRequired,
  token: PropTypes.string,
  setToken: PropTypes.func.isRequired,
  socket: PropTypes.object.isRequired,
};

export default Home;
