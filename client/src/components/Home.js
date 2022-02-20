import React, { useEffect } from "react";
import PropTypes from "prop-types";
import MainNavbar from "./shared/MainNavbar";

const Home = ({ title }) => {
  useEffect(() => {
    // Set page title
    document.title = title;
  }, [title]);

  return (
    <div>
      <MainNavbar />
    </div>
  );
};

Home.propTypes = {
  title: PropTypes.string,
};

export default Home;
