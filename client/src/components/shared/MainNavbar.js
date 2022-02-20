import React from "react";
import { Navbar, NavbarBrand, NavbarText } from "reactstrap";
import { Link } from "react-router-dom";

const MainNavbar = () => {
  return (
    <Navbar color="dark" dark expand="md">
      <div className="container d-flex justify-content-between">
        <NavbarBrand tag={Link} to="/">
          Crypto-Painter
        </NavbarBrand>
        <NavbarText>Address</NavbarText>
      </div>
    </Navbar>
  );
};

export default MainNavbar;
