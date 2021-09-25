import React, { useState } from "react";
import styles from "./NavMenuBar.module.css";
import { Link } from "react-router-dom";
import clsx from "../utils/clsx";
import LogoIcon from "../Assets/logo.svg";
import { FaBars, FaHamburger, FaSearch } from "react-icons/fa";
import ProfileDropdown from "./ProfileDropdown";
import { getLoggedInProfileID } from "../utils/AuthorisationUtils";

function NavMenuBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLoggedIn = !!getLoggedInProfileID();

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
            <Link className={styles.link} to="/">
              Read Blogs
            </Link>
          </li>
          <li>
            <Link
              className={styles.link}
              to={isLoggedIn ? "/addBlogDetailsMarkdown" : "/login"}
            >
              Add Blog
            </Link>
          </li>
          <li>
            <a
              className={styles.link}
              href="http://skionetizy-staging.herokuapp.com/"
            >
              About Us
            </a>
          </li>
          <li>
            <a
              className={styles.link}
              href="http://skionetizy-staging.herokuapp.com/#mission"
            >
              Mission
            </a>
          </li>
          <li>
            <a
              className={clsx(styles.link, styles.linkHighlight)}
              href="http://skionetizy-staging.herokuapp.com/contact-us"
            >
              Support
            </a>
          </li>
        </ul>

        {!isLoggedIn && (
          <Link className={clsx(styles.link, styles.rightItem)} to="/login">
            Login
          </Link>
        )}
      </nav>
    </>
  );
}
export default NavMenuBar;
