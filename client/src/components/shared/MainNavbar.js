import React, { useState } from "react";
import PropTypes from "prop-types";
import { Navbar, NavbarBrand, NavbarText } from "reactstrap";
import { Link } from "react-router-dom";
import Web3 from "web3";

const MainNavbar = ({ account, setAccount, setAlert, setShowAlert }) => {
  const [btnDisabled, setBtnDisabled] = useState(false);

  const enableEth = async () => {
    setBtnDisabled(true);

    if (!window.ethereum) {
      setBtnDisabled(false);
      setAlert(
        "You need to install MetaMask first 🦊 If you don't know what MetaMask is, I recommend you watch this video https://www.youtube.com/watch?v=YVgfHZMFFFQ"
      );
      setShowAlert(true);
      return;
    }

    const timeout = new Promise((resolve) =>
      setTimeout(() => resolve("timed out"), 15000)
    );

    timeout.then(() => {
      setAlert(
        "If the MetaMask pop-up hasn't shown up, open the MetaMask extension manually over your browser and complete the login"
      );
      setShowAlert(true);
      setBtnDisabled(false);
    });

    const accounts = await window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .catch((error) => {
        setAlert(null);
        setShowAlert(false);
        setBtnDisabled(false);
      });

    setAlert(null);
    setShowAlert(false);

    if (!accounts) {
      return;
    }

    window.web3 = new Web3(window.ethereum);

    window.ethereum.on("accountsChanged", function (accounts) {
      setAccount(accounts[0]);
    });

    setAccount(accounts[0]);
    setBtnDisabled(false);
  };

  return (
    <Navbar color="dark" dark expand="md">
      <div className="container d-flex justify-content-between">
        <NavbarBrand tag={Link} to="/">
          Crypto-Painter
        </NavbarBrand>
        {account ? (
          <NavbarText>{account}</NavbarText>
        ) : (
          <button
            className="btn btn-primary"
            onClick={enableEth}
            disabled={btnDisabled}
          >
            Connect to Wallet
          </button>
        )}
      </div>
    </Navbar>
  );
};

MainNavbar.propTypes = {
  account: PropTypes.string,
  setAccount: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  setShowAlert: PropTypes.func.isRequired,
};

export default MainNavbar;
