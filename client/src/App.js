import "./css/style.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home/index.js";
import Web3 from "web3";
import Web3Token from "web3-token";
import About from "./components/About";
import Gallery from "./components/Gallery";
import Mobile from "./components/Mobile";
import { io } from "socket.io-client";
import { isMobile } from "react-device-detect";
import { signStatement } from "./constants";

// Establish socket connection through socket.io
const socket = io("https://crypto-painter2.herokuapp.com/"); // Add to dotenv maybe

const App = () => {
  const [account, setAccount] = useState(null);
  const [token, setToken] = useState(null);
  const [renderDesktop, setRenderDesktop] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      if (!window.ethereum) {
        return;
      }

      const web3 = new Web3(window.ethereum);

      const accounts = await Promise.race([
        web3.eth.getAccounts(),
        new Promise((resolve) => setTimeout(() => resolve("timed out"), 10000)),
      ]);

      if (typeof accounts === "string") {
        window.location.reload();
        return;
      }

      if (accounts.length === 0) {
        return;
      }

      window.web3 = web3;

      setAccount(accounts[0]);

      window.ethereum.on("accountsChanged", function (accounts) {
        setToken(null);

        if (accounts.length === 0) {
          setAccount(null);
          localStorage.removeItem("token");
          return;
        }

        setAccount(accounts[0]);

        Web3Token.sign((msg) => web3.eth.personal.sign(msg, accounts[0], ""), {
          statement: signStatement,
        })
          .then((token) => {
            setToken(token);
            localStorage.setItem("token", token);
          })
          .catch(() => {});
      });

      const token = localStorage.getItem("token");

      if (token) {
        let address;

        try {
          const result = await Web3Token.verify(token);
          address = result.address;
        } catch (error) {
          console.log(error);
        }

        if (!address || address.toLowerCase() !== accounts[0].toLowerCase()) {
          localStorage.removeItem("token");
          Web3Token.sign(
            (msg) => web3.eth.personal.sign(msg, accounts[0], ""),
            {
              statement: signStatement,
            }
          )
            .then((token) => {
              localStorage.setItem("token", token);
              setToken(token);
            })
            .catch(() => {});
          return;
        }

        setToken(token);
        return;
      }
    };
    checkConnection();
  }, []);

  if (isMobile && !renderDesktop) {
    return <Mobile setRenderDesktop={setRenderDesktop} socket={socket} />;
  }

  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <Home
              title="Crypto-Painter"
              account={account}
              setAccount={setAccount}
              token={token}
              setToken={setToken}
              socket={socket}
            />
          }
        />
        <Route
          exact
          path="/about"
          element={
            <About
              title="About Crypto-Painter"
              account={account}
              setAccount={setAccount}
              setToken={setToken}
            />
          }
        />
        {/* <Route
          exact
          path="/gallery"
          element={
            <Gallery
              title="Crypto-Painter Gallery"
              account={account}
              setAccount={setAccount}
              setToken={setToken}
            />
          }
        /> */}
        <Route path="*" element={<h1 className="text-light m-2">404</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
