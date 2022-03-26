import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import MainNavbar from "../shared/MainNavbar";
import MainFooter from "../shared/MainFooter";
import Chat from "./Chat/index.js";
import Alert from "../shared/Alert";
import loading from "../../assets/loading.gif";
import Menu from "./Menu";
import Web3Token from "web3-token";
import { signStatement } from "../../constants";
import { SiBinance } from "react-icons/si";

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
  const [queuedStrokes, setQueuedStrokes] = useState([]);

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

    socket.on("disconnect", () => {
      setIsWaitingForServer(true);
    });

    socket.on("connect", () => {
      setIsWaitingForServer(false);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    // Remove old listener
    socket.removeListener("stroke");

    // Wait for new strokes from others
    socket.on("stroke", (stroke) => {
      console.log("New other stroke");

      if (!isDrawing) {
        drawStroke(stroke);
        return;
      }

      // Add stroke to queue bc user is drawing
      console.log("Added new other stroke to queue");
      setQueuedStrokes([...queuedStrokes, stroke]);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineWidth, lineColor, isDrawing, queuedStrokes, socket]);

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

    // Draw queued strokes
    if (queuedStrokes.length > 0) {
      queuedStrokes.forEach((queuedStroke) => drawStroke(queuedStroke));
      setQueuedStrokes([]);
    }

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

    // Draw
    ctx.beginPath();
    stroke.points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
        return;
      }
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    });
    ctx.closePath();

    // Reset style
    resetCanvasStyle();
  };

  const showNotAllowedAlert = () => {
    if (isUpdatingCanvas || isWaitingForServer) {
      return;
    }

    let alertMsg;

    if (!account) {
      alertMsg = "You need to connect your wallet before you can draw";
      setAlert(alertMsg);
      setShowAlert(true);
      return;
    }

    Web3Token.sign((msg) => window.web3.eth.personal.sign(msg, account, ""), {
      statement: signStatement,
    })
      .then((token) => {
        setToken(token);
        localStorage.setItem("token", token);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Alert
        content={alert}
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        setAlert={setAlert}
      />
      <div className="d-flex justify-content-center">
        <div className="crypto-container">
          <MainNavbar
            account={account}
            setAccount={setAccount}
            setAlert={setAlert}
            setShowAlert={setShowAlert}
            setToken={setToken}
          />
          <p className="text-light m-0">
            This is a 720x576 pixel canvas. Every day at midnight (GMT) the
            canvas is reset and the Crypto-Painting created is gifted as an NFT
            to a random contributor to the painting (anyone who painted at least
            1 stroke is considered a contributor). Connect your wallet to start
            painting.
          </p>

          <div className="d-flex justify-content-center mt-3">
            <div className="draw-container">
              <Menu setLineColor={setLineColor} setLineWidth={setLineWidth} />
              <div className="position-relative">
                <canvas
                  onMouseDown={
                    token && !isUpdatingCanvas && !isWaitingForServer
                      ? startDrawing
                      : showNotAllowedAlert
                  }
                  onMouseUp={
                    token && !isUpdatingCanvas && !isWaitingForServer
                      ? endDrawing
                      : null
                  }
                  onMouseMove={
                    token && !isUpdatingCanvas && !isWaitingForServer
                      ? draw
                      : null
                  }
                  onMouseOut={
                    token && !isUpdatingCanvas && !isWaitingForServer
                      ? endDrawing
                      : null
                  }
                  ref={canvasRef}
                  width={`720px`}
                  height={`576px`}
                  className="draw-area bg-white border border-secondary border-4 border-bottom-0"
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
              <p className="m-0 blockchain-info bg-secondary rounded-bottom p-1 text-light position-relative">
                Smart contract{" "}
                <a
                  href="https://bscscan.com/address/0x0563a5E30Bd676CafD40430B42C2cd749D8140Ca/"
                  className="text-decoration-none hover-underline text-light"
                >
                  0x0563a5E30Bd676CafD40430B42C2cd749D8140Ca
                </a>{" "}
                on{" "}
                <strong className="text-binance">
                  BINANCE SMART CHAIN{" "}
                  <SiBinance className="blockchain-icon ms-1" />
                </strong>
              </p>
            </div>
            <Chat
              socket={socket}
              setAlert={setAlert}
              setShowAlert={setShowAlert}
              token={token}
            />
          </div>
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
