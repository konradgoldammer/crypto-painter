import React, { useState } from "react";
import PropTypes from "prop-types";
import { Navbar, NavbarBrand, NavbarText } from "reactstrap";
import { Link } from "react-router-dom";
import loading from "../../assets/loading.gif";
import { signMsg } from "../../constants.js";
import Web3 from "web3";
import Web3Token from "web3-token";

const MainNavbar = ({
  account,
  setAccount,
  setAlert,
  setShowAlert,
  setToken,
}) => {
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

          const web3 = new Web3(window.ethereum);
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

            Web3Token.sign((msg) =>
              web3.eth.personal.sign(msg, accounts[0], signMsg)
            )
              .then((token) => {
                setToken(token);
                localStorage.setItem("token", token);
              })
              .catch(() => {});
          });

          Web3Token.sign((msg) =>
            web3.eth.personal.sign(msg, accounts[0], signMsg)
          )
            .then((token) => {
              setToken(token);
              localStorage.setItem("token", token);
              setIsConnecting(false);
            })
            .catch(() => {
              setIsConnecting(false);
            });
        }),
    ]);

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
  setToken: PropTypes.func.isRequired,
};

export default MainNavbar;
