import React, { useEffect } from "react";
import PropTypes from "prop-types";
import MainNavbar from "./shared/MainNavbar";

const Home = ({ title, account, setAccount }) => {
  useEffect(() => {
    // Set page title
    document.title = title;
  }, [title]);

  return (
    <div>
      <MainNavbar account={account} setAccount={setAccount} />
    </div>
  );
};

Home.propTypes = {
  title: PropTypes.string,
  account: PropTypes.string,
  setAccount: PropTypes.func,
};

export default Home;
