import React from "react";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";
import {
  RiFacebookFill,
  RiTwitterFill,
  RiLinkedinFill,
  RiInstagramLine,
} from "react-icons/ri";
import LogoIcon from "../Assets/logo-new.svg";

function Footer() {
  return (
    <footer>
      <div id={styles.lFooter} className={styles.footerWrapper}>
        <section className={styles.footerFlex}>
          <p className={styles.footerLogo}>
            <img
              className={styles.footerLogoImg}
              src={LogoIcon}
              alt="fountain pen's tip camera closeup"
            />
            Papersdrop
          </p>
          <h2>Place where intuitiveness begins</h2>
          <p className={styles.footerFlexText}>
          We at Papersdrop, strive towards one goal 
          which is to bring awareness on timeless content 
          to everyone, right in the palm of the hands. 
          The doors are open to every enthusiast out there 
          who are willing to join and play a part in our 
          enlightening journey.
          </p>
        </section>

        <section className={styles.siteLinks}>
          <h2>Support</h2>
          {supportLinks.map((links) => (
            <ul>
              {Object.entries(links).map(([name, value]) => (
                <li>
                  <Link to={value}>{name}</Link>
                </li>
              ))}
            </ul>
          ))}
        </section>

        <section className={styles.siteLinks}>
          <h2>Company</h2>
          {companyLinks.map((links) => (
            <ul>
              {Object.entries(links).map(([name, value]) => (
                <li>
                  <Link to={value}>{name}</Link>
                </li>
              ))}
            </ul>
          ))}
        </section>

        <section className={styles.socials}>
          <span className={styles.socialsLead}>Follow us on:</span>
          <div className={styles.socialmedias}>
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
          </div>
          <button className={styles.hireme}>Hire me</button>
        </section>
      </div>

      <div id={styles.sFooter} className={styles.footerWrapper}>
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
            Papersdrop
          </p>

          <p className={styles.footerCopyright}>
            Copyright &copy; Papersdrop 2021
          </p>
        </section>
      </div>
    </footer>
  );
}

const supportLinks = [
  {
    "Home": "/",
    "Login": "/login",
    "About Us": "/landing#about"
  }
]

const companyLinks = [
  {
    "Contact Us": "/contact",
    "Privacy Policy": "/privacy-policy",
    "Terms and condition": "/terms-and-conditions",
    "DMCA": "/dmca"
  }
]

const siteLinks = [
  {
    // Services: "/service",
    "About us": "/landing#about",
    Signup: "/signup",
  },
  {
    Mission: "/landing#mission",
    "Create Blog": "/addBlogDetailsMarkdown",
    // Help: "/help",
    // "Contact Us": "/contact-us",
  },
  {
    Login: "/login",
    // "Privacy Policy": "/privacy-policy",
    // "Copyright Policy": "/copyright-policy",
  },
];

export default Footer;
