import React from "react";
// import '../index.css'
import { Link, useLocation } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import style from "../Components/nav.module.css";
import SearchBar from "./searchBar";
import ProfileDropdown from "./ProfileDropdown";
import LogoIcon from "../Assets/logo.svg";

function Nav() {
  const path = useLocation();

  return (
    <div className={style.container}>
      <nav className={style.nav}>
        <div className={style.header}>
          <Link className={style.logoLink} to="/">
            <img
              src={LogoIcon}
              alt="fountain pen with tip as hotspot"
              width="64"
              height="64"
            />
          </Link>
        </div>
        <input type="checkbox" id="nav-toggle" className={style.navToggle} />
        <label className={style.hamburger} htmlFor="nav-toggle">
          <MenuIcon fontSize="large" className={style.hamburgerIcon} />
        </label>

        {path.pathname === "/explore-blogs" && <SearchBar />}

        <ul className={style.links}>
          <li className={style.link}>
            <Link className={style.navLink} to="/explore-blogs">
              Explore
            </Link>
          </li>
          <li className={style.link}>
            <Link className={style.navLink} to="#">
              About us
            </Link>
          </li>
          <li className={style.link}>
            <Link className={style.navLink} to="#">
              Contact us
            </Link>
          </li>
          <li className={style.link}>
            <Link className={style.navLink} to="#">
              Get Started
            </Link>
          </li>
        </ul>

        <div className={style.profileIconWrapper}>
          <ProfileDropdown />
        </div>
      </nav>
    </div>
  );
}

export default Nav;
