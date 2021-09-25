import React, { useState } from "react";
import styles from "./NavMenuBar.module.css";
import { Link } from "react-router-dom";
import clsx from "../utils/clsx";
import LogoIcon from "../Assets/logo.svg";
import { FaBars, FaHamburger, FaSearch } from "react-icons/fa";
import ProfileDropdown from "./ProfileDropdown";
import { getLoggedInProfileUserName } from "../utils/AuthorisationUtils";

function NavMenuBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLoggedIn = !!getLoggedInProfileUserName();

  return (
    <>
      <header className={styles.header}>
        <button
          className={styles.hamburger}
          onClick={() => setIsMenuOpen((p) => !p)}
        >
          <FaBars />
        </button>

        <Link className={styles.logoLink} to="/">
          <img
            src={LogoIcon}
            alt="fountain pen with tip as hotspot"
            width="64"
            height="64"
          />
          <p className={styles.headerTitle}>Skionetizy</p>
        </Link>

        <form className={styles.inputContainer}>
          <input />
          <button>
            <FaSearch />
          </button>
        </form>

        <ProfileDropdown />
      </header>

      <nav
        className={clsx(
          styles.nav,
          isMenuOpen ? styles.navOpen : styles.navClose
        )}
      >
        <ul className={styles.links}>
          <li>
            <Link className={styles.link}> Read Blogs</Link>
          </li>
          <li>
            <Link className={styles.link}> Add Blog</Link>
          </li>
          <li>
            <Link className={styles.link}> About Us</Link>
          </li>
          <li>
            <Link className={styles.link}> Mission</Link>
          </li>
          <li>
            <Link className={clsx(styles.link, styles.linkHighlight)}>
              Support
            </Link>
          </li>
        </ul>

        {!isLoggedIn && (
          <>
            <Link className={clsx(styles.link, styles.rightItem)} to="/login">
              Login
            </Link>

            <Link className={clsx(styles.link, styles.rightItem)} to="/signup">
              Signup
            </Link>
          </>
        )}
      </nav>
    </>
  );
}
export default NavMenuBar;
