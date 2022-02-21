import React, { useState } from "react";
import PropTypes from "prop-types";
import { Navbar, NavbarBrand, NavbarText } from "reactstrap";
import { Link } from "react-router-dom";
import Web3 from "web3";

const MainNavbar = ({ account, setAccount }) => {
  const [btnDisabled, setBtnDisabled] = useState(false);

  const enableEth = async () => {
    setBtnDisabled(true);

    if (!window.ethereum) {
      setBtnDisabled(false);
      alert("You need to install MetaMask first");
      return;
    }

    const accounts = await window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .catch((error) => {
        setBtnDisabled(false);
      });

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
  setAccount: PropTypes.func,
};

export default MainNavbar;
