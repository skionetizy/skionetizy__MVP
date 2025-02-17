import React from "react";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";
import {
  RiFacebookFill,
  RiTwitterFill,
  RiLinkedinFill,
  RiInstagramLine,
} from "react-icons/ri";
import LogoIcon from "../Assets/logo.svg";

function Footer() {
  return (
    <footer className={styles.footerWrapper}>
      <section className={styles.socials}>
        <span className={styles.socialsLead}>Follow us</span>

        <Link>
          <RiTwitterFill />
        </Link>
        <Link>
          <RiFacebookFill />
        </Link>
        <Link>
          <RiInstagramLine />
        </Link>
        <Link>
          <RiLinkedinFill />
        </Link>
      </section>

      <section className={styles.siteLinks}>
        {siteLinks.map((links) => (
          <ul>
            {Object.entries(links).map(([name, value]) => (
              <li>
                <Link to={value}>{name}</Link>
              </li>
            ))}
          </ul>
        ))}
      </section>

      <section className={styles.footerFlex}>
        <p className={styles.footerLogo}>
          <img
            className={styles.footerLogoImg}
            src={LogoIcon}
            alt="fountain pen's tip camera closeup"
          />
          Skionetizy
        </p>

        <p className={styles.footerCopyright}>
          Copyright &copy; Skionetizy 2021
        </p>
      </section>
    </footer>
  );
}

const siteLinks = [
  {
    Services: "/service",
    "About us": "/about-us",
  },
  {
    Career: "/career",
    Help: "/help",
    "Contact Us": "/contact-us",
  },
  {
    Terms: "/terms",
    "Privacy Policy": "/privacy-policy",
    "Copyright Policy": "/copyright-policy",
  },
];

export default Footer;
