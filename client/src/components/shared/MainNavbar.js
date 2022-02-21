import React, { useState } from "react";
import PropTypes from "prop-types";
import { Navbar, NavbarBrand, NavbarText } from "reactstrap";
import { Link } from "react-router-dom";
import loading from "../../assets/loading.gif";
import Web3 from "web3";

const MainNavbar = ({ account, setAccount, setAlert, setShowAlert }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const enableEth = async () => {
    setIsConnecting(true);

    if (!window.ethereum) {
      setAlert(
        "You need to install MetaMask first 🦊 If you don't know what MetaMask is, I recommend you watch this video https://www.youtube.com/watch?v=YVgfHZMFFFQ"
      );
      setShowAlert(true);
      setIsConnecting(false);
      return;
    }

    const timedOut = await Promise.race([
      new Promise((resolve) => setTimeout(() => resolve("timed out"), 15000)),
      window.ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .catch((error) => {
          setAlert(null);
          setShowAlert(false);
          setIsConnecting(false);
        })
        .then((accounts) => {
          setAlert(null);
          setShowAlert(false);

          if (!accounts) {
            setIsConnecting(false);
            return;
          }

          window.web3 = new Web3(window.ethereum);

          window.ethereum.on("accountsChanged", function (accounts) {
            setAccount(accounts[0]);
          });

          setAccount(accounts[0]);
          setIsConnecting(false);
        }),
    ]);

    console.log(timedOut);

    if (timedOut) {
      setAlert(
        "If the MetaMask pop-up hasn't shown up, open the MetaMask extension manually over your browser and complete the login"
      );
      setShowAlert(true);
    }
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
          <div>
            <button
              className="btn btn-primary"
              onClick={enableEth}
              disabled={isConnecting}
            >
              Connect to Wallet
            </button>
            {isConnecting && (
              <img
                src={loading}
                alt="connecting..."
                title="connecting..."
                className="ms-2 loading"
              />
            )}
          </div>
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
