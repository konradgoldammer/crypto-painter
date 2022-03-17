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
        <h3 className="text-center">WHAT IS CRYPTO-PAINTER?</h3>
        <p>
          Crypto-Painter is a unique NFT project launched in March 2022. This
          website acts as a collaborative painting application that allows
          anyone to participate in drawing a picture together online and in real
          time. Every day at midnight (Greenwich Mean Time) the canvas is reset
          and the Crypto-Painting created is gifted to a random contributor to
          the painting (anyone who painted at least 1 stroke is considered a
          contributor).
        </p>
        <h3 className="text-center">HOW CAN I PARTICIPATE?</h3>
        <h4>Step 1: Add MetaMask to your browser</h4>
        <p>
          MetaMask is a browser extension that gives you access to an Ethereum
          wallet through your browser, allowing you to interact with
          decentralized applications like Crypto-Painter. Download MetaMask at{" "}
          <a href="https://metamask.io/download" className="text-light">
            www.metamask.io/download
          </a>
          .
        </p>
        <h4>Step 2: Connect to MetaMask</h4>
        <p>
          For authentication you need to connect this website to your MetaMask
          wallet. Click on the blue „Connect to Wallet“ button in the top right
          corner and you should see a MetaMask window popping up. Proceed by
          selecting your wallet and connecting it to this website through the
          MetaMask browser extension. Once you are logged in, you will see your
          wallet address in the top right corner. If the MetaMask window doesn’t
          appear, try refreshing the page or manually opening MetaMask from your
          browser extension panel. If this doesn’t help restart your browser and
          make sure you installed MetaMask correctly.
        </p>
        <h4>Step 3: Start Drawing</h4>
        <p>
          After connecting your wallet to Crypto-Painter, you can now paint on
          the canvas and communicate with other Crypto-Painters via chat. You
          can choose the brush color and width using the menu above the canvas.
          Remember that zooming in and out of the window (ctrl + mouse wheel)
          can make adding details to your drawing much easier.
        </p>
        <h4>Step 4: Win</h4>
        <p>
          After you paint on the canvas, you are considered a contributor to the
          Crypto-Painting. At midnight (Greenwich Mean Time), the
          Crypto-Painting created is gifted to a random contributor as an NFT.
          Now that you're a contributor yourself, you now have a fair chance of
          winning the Crypto-Painting as an NFT. Much luck!
        </p>
        <h3 className="text-center">HOW DO I KNOW IF I WON?</h3>
        <p>
          If you have won the latest Crypto-Painting, you will receive an alert
          from this website with the token ID and the transaction hash when you
          log in (this alert is very noticeable, you will not miss it). If for
          whatever reason you don't receive this alert, you can always go to our
          Twitter{" "}
          <a href="https://twitter.com/crypt0painter" className="text-light">
            @crypt0painter
          </a>{" "}
          where the crypto paintings are posted and the winners announced.
        </p>
        <h3 className="text-center">HOW CAN I SEE MY NFT IN METAMASK?</h3>
        <h4>Step 1: Add BSC to MetaMask</h4>
        <p>
          Crypto-Painter is built on the Binance Smart Chain (BSC), but Ethereum
          is MetaMask's default network. Therefore, you need to add BSC as a
          network to MetaMask. I recommend reading this article{" "}
          <a
            href="https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain"
            className="text-light"
          >
            www.academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain
          </a>{" "}
          for details. All in all, connecting MetaMask to BSC is a fairly simple
          process that shouldn't take much more than 5 minutes.
        </p>
        <h4>Step 2: Import token to MetaMask</h4>
        <p>
          In MetaMask's Assets column, click "Import Token" and MetaMask will
          ask you for 3 things: "Token Contract Address", "Token Symbol" and
          "Token Decimal". Enter{" "}
          <span className="text-primary">
            0x0563a5E30Bd676CafD40430B42C2cd749D8140Ca
          </span>{" "}
          for the token contract address,{" "}
          <span className="text-primary">CPA</span> for the token symbol, and 0
          for the token decimal. Now CPA (Crypto-Painting) is listed as an asset
          in MetaMask.
        </p>
        <h4>Step 3: Import NFT to MetaMask</h4>
        <p>
          Unfortunately, as of now there is no way to actually display your NFT
          in MetaMask's browser extension. To do this, you need to install the
          MetaMask mobile app from the Play Store or App Store. After importing
          your MetaMask wallet with your mnemonic phrase and adding BSC as a
          network in the mobile app, you need to click "Import NFTs" in
          MetaMask's NFTs column. MetaMask will ask you for 2 things: "Address"
          (address of the NFT contract) and "ID" (token ID of the NFT you want
          to add). Enter{" "}
          <span className="text-primary">
            0x0563a5E30Bd676CafD40430B42C2cd749D8140Ca
          </span>{" "}
          for the address and the token ID of an arbitrary Crypto-Painting that
          you own for the ID. The token ID is included in the alert you receive
          when you win a Crypto-Painting. Alternatively, you can look up the
          token ID for each Crypto-Painting at{" "}
          <a href="https://twitter.com/crypt0painter" className="text-light">
            @crypt0painter
          </a>{" "}
          on Twitter.
        </p>
        <h3 className="text-center">QUESTIONS?</h3>
        <p>
          If you have any questions, please feel free to contact me: E-Mail
          konradgoldammer@gmail.com, Instagram:{" "}
          <a
            href="https://instagram.com/konradgoldammer"
            className="text-light"
          >
            @konradgoldammer
          </a>{" "}
          , Twitter:{" "}
          <a href="https://twitter.com/konradgoldammer" className="text-light">
            @konradgoldammer
          </a>
          .
        </p>
        <hr />
        <h3 className="text-center">SUPPORT</h3>
        <p>
          If you like this project I would be very greatful if you could share
          it with your friends. Additionaly, you can support me with a donation
          to my ETH/BNB wallet 0xd4770038BBd26C12c191789CfCF7CBd29932D606 or BTC
          wallet 1NnxcZvf9BvDdoNyEtxgTZxcHa54e14HSL ❤. Thanks, Konrad.
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
