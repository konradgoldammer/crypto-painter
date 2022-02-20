import "./css/style.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";

const App = () => {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    // Add stay logged into metamask
    // if (!window.web3) {
    //   return;
    // }
    // window.ethereum.on("accountsChanged", function (accounts) {
    //   setAccount(accounts[0]);
    // });
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
