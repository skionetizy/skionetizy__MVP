import React from "react";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";
import {
  RiMapPinLine,
  RiFacebookCircleLine,
  RiTwitterLine,
  RiLinkedinBoxLine,
  RiMailLine,
} from "react-icons/ri";

// function Footer() {
//   return (
//     <footer className="footer-container">
//       <div className="social-icons">
//         <Link
//           className="social-icon-link"
//           to="/"
//           target="_blank"
//           aria-label="Facebook"
//         >
//           <FaFacebook />
//         </Link>
//         <Link
//           className="social-icon-link"
//           to="/"
//           target="_blank"
//           aria-label="Instagram"
//         >
//           <FaInstagram />
//         </Link>
//         <Link
//           className="social-icon-link"
//           to={
//             "//www.youtube.com/channel/UCsKsymTY_4BYR-wytLjex7A?view_as=subscriber"
//           }
//           target="_blank"
//           aria-label="Youtube"
//         >
//           <FaYoutube />
//         </Link>
//         <Link
//           className="social-icon-link"
//           to="/"
//           target="_blank"
//           aria-label="Twitter"
//         >
//           <FaTwitter />
//         </Link>
//         <Link
//           className="social-icon-link"
//           to="/"
//           target="_blank"
//           aria-label="LinkedIn"
//         >
//           <FaLinkedin />
//         </Link>
//       </div>

//       <section className="footer-subscription">
//         <p className="footer-subscription-menu">
//           Help Center | Privacy Policy | Career | Forum | Copyright Policy
//         </p>

//         <p className="website-rights"> Copyright Skionetizy © 2021</p>

//         <button className="topBtn" onClick={() => window.scrollTo(0, 0)}>
//           <svg
//             width="43"
//             height="44"
//             viewBox="0 0 43 44"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M29 31L21 23L13 31"
//               stroke="currentColor"
//               stroke-width="2"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//             />
//             <path
//               d="M29 20L21 12L13 20"
//               stroke="currentColor"
//               stroke-width="2"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//             />
//             <circle cx="21.5" cy="22.5" r="21" stroke="currentColor" />
//           </svg>
//         </button>
//       </section>
//     </footer>
//   );
// }

function Footer() {
  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.grid}>
        <img src="" className={styles.logo} alt="main logo" />
        

        <p className={styles.about}>
          consectetur adipiscing elit, sed do eiusmod tempor incididunt.Lorem
          ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt.
        </p>

        <ul className={styles.siteLinks}>
          <li>
            <Link to="/#about">About</Link>
          </li>
          <li>
            <Link to="#features">Features</Link>
          </li>
          <li>
            <Link to="/contact-us">Contact</Link>
          </li>
        </ul>

        <ul className={styles.socialLinks}>
          <li>
            <a href="#facebook">
              <RiFacebookCircleLine />
            </a>
          </li>

          <li>
            <a href="#twitter">
              <RiTwitterLine />
            </a>
          </li>

          <li>
            <a href="#linkedin">
              <RiLinkedinBoxLine />
            </a>
          </li>
        </ul>

        <div className={styles.addresses}>
          <p className={styles.address}>
            <RiMapPinLine />
            Technology Tower, VIT Vellore-632014
          </p>

          <p className={styles.address}>
            <RiMailLine />
            team@skionetizy.com
          </p>
        </div>
      </div>

      <hr/>

      <div className={styles.flex}>
        <ul className={styles.menu}>
          <li className={styles.menuItem}>
            <Link to="/contact-us">Help Center</Link>
          </li>

          <li className={styles.menuItem}>
            <Link to="#">Privacy Policy</Link>
          </li>

          <li className={styles.menuItem}>
            <Link to="#">Career</Link>
          </li>

          <li className={styles.menuItem}>
            <Link to="#">Forum</Link>
          </li>

          <li className={styles.menuItem}>
            <Link to="#">Copyright Policy</Link>
          </li>
        </ul>

        <p className={styles.copyRight}>
          Copyright © 2021. Skionetizy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
