import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import logo from "./LOGO.svg";
import SearchForm from "../SearchForm/SearchForm";

const NavBar: React.FC = () => {
  const handleLogOut = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };
  return (
    <nav>
      <div className="nav_log">
        <img src={logo} />
      </div>
      <SearchForm />
      <div className="Nav_links">
        <Link to="/">Home</Link>
        {/* <Link to="/explore">Explore</Link> */}
        {/* <Link to="/notifications">Notifications</Link> */}
        <Link to="/messages">Messages</Link>
        <Link to="/buyouts">Biddings</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/buyout">Buyout</Link>
        <Link to="/about">About</Link>
        <button onClick={handleLogOut}>log out</button>
      </div>
    </nav>
  );
};

export default NavBar;
