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
import Countdown from "react-countdown";
import polygonLogo from "../../assets/polygon.png";

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
  const [nextTokenId, setNextTokenId] = useState(0);
  const [totalPainters, setTotalPainters] = useState(0);
  const [nextResetDate, setNextResetDate] = useState(Date.now() + 86400000);

  useEffect(() => {
    // Set page title
    document.title = title;
  }, [title]);

  useEffect(() => {
    // Get image obj
    socket.emit("image", (image, nextTokenId) => {
      console.log("Loading image...");
      image.strokes.forEach((stroke) => drawStroke(stroke));
      setIsUpdatingCanvas(false);
      setNextTokenId(nextTokenId);
      setTotalPainters(image.painters.length);

      let date = new Date();
      date.setUTCHours(24, 0, 0, 0);
      setNextResetDate(date);
    });

    // Wait for reset
    socket.on("reset", () => {
      console.log("RESET!");
      window.location.reload(); // RELOAD ON RESET ONLY TEMPORARY SOLUTION

      // const canvas = canvasRef.current;
      // const ctx = canvas.getContext("2d");
      // ctx.clearRect(0, 0, 720, 576);
      // ctxRef.current = ctx;

      // setAlert(
      //   "Time's up! The Canvas has been reset. The created image has been raffled off as an NFT to a random contributor. 🥳"
      // );
      // setShowAlert(true);
      // setNextTokenId(nextTokenId + 1);

      // let date = new Date();
      // date.setUTCHours(24, 0, 0, 0);
      // setNextResetDate(date.getTime());
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
    socket.on("stroke", (stroke, isNewPainter) => {
      console.log("New other stroke");

      if (isNewPainter) {
        setTotalPainters(totalPainters + 1);
      }

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
    socket.emit("stroke", currentStroke, (error, isNewPainter) => {
      if (error) {
        setAlert(error);
        setShowAlert(true);
      }

      if (isNewPainter) {
        setTotalPainters(totalPainters + 1);
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
          <p className="text-light m-0 mt-2">
            This is a 720x576 pixel canvas. Every day at midnight (GMT) the
            canvas is reset and the Crypto-Painting created is gifted as an NFT
            to a random contributor to the painting (anyone who painted at least
            1 stroke is considered a contributor). Connect your wallet to start
            painting. So far{" "}
            <span className="text-primary">
              {totalPainters === 1
                ? `${totalPainters} person`
                : `${totalPainters} people`}
            </span>{" "}
            {totalPainters === 1 ? "has" : "have"} contributed painting{" "}
            <span className="text-primary">Crypto-Painting #{nextTokenId}</span>
            . The canvas will reset and the painting will be gifted in{" "}
            {
              <Countdown
                date={nextResetDate}
                renderer={({ hours, minutes, seconds, completed }) => {
                  if (completed) {
                    return <span className="text-success">a moment</span>;
                  } else {
                    return (
                      <span className="text-primary">
                        {hours < 10 ? `0${hours}` : hours}:
                        {minutes < 10 ? `0${minutes}` : minutes}:
                        {seconds < 10 ? `0${seconds}` : seconds}
                      </span>
                    );
                  }
                }}
              />
            }
            .
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
                Contract{" "}
                <a
                  href="https://polygonscan.com/address/0x2511cBFFC60EE51D7226922fEd5630CE970ec8cB"
                  className="text-decoration-none hover-underline text-light"
                >
                  0x2511cBFFC60EE51D7226922fEd5630CE970ec8cB
                </a>{" "}
                powered by
                <a
                  href="https://polygon.technology/"
                  className="text-decoration-none text-light bg-polygon px-2 rounded border-light border border-1 ms-2 blockchain-icon hover-underline"
                >
                  <img src={polygonLogo} alt="" className="logo-polygon mb-1" />
                  <strong className="ms-1">POLYGON</strong>
                </a>
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
