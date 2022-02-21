import "./css/style.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home/index.js";
import Web3 from "web3";

const App = () => {
  const [account, setAccount] = useState(null);

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

      window.ethereum.on("accountsChanged", function (accounts) {
        setAccount(accounts[0]);
      });

      setAccount(accounts[0]);
    };
    checkConnection();
  }, []);

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
            />
          }
        />
        <Route path="*" element={<h1 className="text-light m-2">404</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
