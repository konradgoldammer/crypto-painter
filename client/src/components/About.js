import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import MainNavbar from "./shared/MainNavbar.js";
import Alert from "./shared/Alert.js";

const About = ({ title, account, setAccount, setToken }) => {
  useEffect(() => {
    // Set page title
    document.title = title;
  }, [title]);

  const [alert, setAlert] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

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
      <div className="container text-light">
        <h3 className="text-center">1. CONNECT</h3>
        <p>
          Connect your Ethereum wallet using MetaMask. If you don't have
          MetaMask installed, you can download it for your browser here{" "}
          <a href="https://metamask.io/download/" className="text-light">
            https://metamask.io/download/
          </a>
        </p>
        <h3 className="text-center">2. DRAW</h3>
        <p>
          Select your brush color and width and draw whatever you like. Remember
          that all Crypto-Painters, like yourself, share the same canvas.
        </p>
        <h3 className="text-center">3. WIN</h3>
        <p>
          Every day at 12 PM UTC the canvas will be reset and one lucky randomly
          selected collaborator will win an NFT version of the collaboratively
          created image. The smart contract that powers the Crypto-Paintings is
          built on top of the Ethereum blockchain and follows the ERC-721
          standard.
        </p>
      </div>
    </div>
  );
};

About.propTypes = {
  title: PropTypes.string,
  account: PropTypes.string,
  setAccount: PropTypes.func.isRequired,
  setToken: PropTypes.func.isRequired,
};

export default About;
