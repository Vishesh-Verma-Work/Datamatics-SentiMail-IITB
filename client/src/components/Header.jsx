import React from 'react';
import '../styles/header.css';
import { NavLink } from "react-router-dom";


const Header = () => {
  return (
    <header className="header">
      <div className="header__logo">MERN App</div>
      <nav className="header__nav">
        <NavLink to={"/"} className="header__link">Home</NavLink>
        <NavLink to={"/processMails"} className="header__link">Process Mails</NavLink>
        <NavLink to={"/pushMail"} className="header__link">Push Mail</NavLink>
        <NavLink to={"/show"} className="header__link">Show All Mails</NavLink>
      </nav>
      <div className="header__toggle" id="headerToggle">
        ☰
      </div>
    </header>
  );
};

export default Header;
