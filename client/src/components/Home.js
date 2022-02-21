import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import MainNavbar from "./shared/MainNavbar";
import Alert from "./shared/Alert";

const Home = ({ title, account, setAccount }) => {
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
      />
      <Alert
        content={alert}
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        setAlert={setAlert}
      />
    </div>
  );
};

Home.propTypes = {
  title: PropTypes.string,
  account: PropTypes.string,
  setAccount: PropTypes.func,
};

export default Home;
