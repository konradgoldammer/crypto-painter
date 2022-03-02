import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import MainNavbar from "./shared/MainNavbar.js";
import Alert from "./shared/Alert.js";
import MainFooter from "./shared/MainFooter";

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
      <div className="container text-light mt-3">
        <h3 className="text-center">1. CONNECT</h3>
        <p>
          Connect your Ethereum wallet using MetaMask. If you don't have
          MetaMask installed, you can download it for your browser here
          <a href="https://metamask.io/download/" className="text-light ms-1">
            https://metamask.io/download/
          </a>
          . If you don't know what MetaMask is, I recommend watching this video
          <a
            href="https://www.youtube.com/watch?v=YVgfHZMFFFQ"
            className="text-light ms-1"
          >
            https://www.youtube.com/watch?v=YVgfHZMFFFQ
          </a>
          .
        </p>
        <h3 className="text-center">2. DRAW</h3>
        <p>
          Select your brush color and width and draw whatever you like. Remember
          that all Crypto-Painters, like yourself, share the same canvas.
        </p>
        <h3 className="text-center">3. WIN</h3>
        <p>
          Every day at 12 midnight UTC the canvas will be reset and one lucky
          randomly selected collaborator will win an NFT version of the
          collaboratively created image. The smart contract that powers the
          Crypto-Paintings is built on top of the Ethereum blockchain and
          follows the ERC-721 standard.
        </p>
        <hr />
        <h3 className="text-center">SUPPORT</h3>
        <p>
          If you like this project I would be very greatful if you could share
          it with your friends. Additionaly, you can support me with a donation
          to my ETH wallet 0x6415ed9272bE40dAFb0bbA01ab4cB31A93a6f5d9 ❤. Thanks,
          Konrad.
        </p>
      </div>
      <MainFooter />
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
