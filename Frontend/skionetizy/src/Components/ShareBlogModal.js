import React from "react";
import styles from "./ShareBlogModal.module.css";
import Modal from "./Modal";
import Tooltip from "../Components/Tooltip";
import * as shareURL from "../utils/shareURL";
// icons
import { FaTimes } from "react-icons/fa";
import TwitterIcon from "../Assets/twitter-square-color.svg";
import FacebookIcon from "../Assets/facebook-square-color.svg";
import WhatsappIcon from "../Assets/whatsapp-square-color.svg";
import LinkedinIcon from "../Assets/linkedin-square-color.svg";

export default function ShareBlogModal({ onClose, blog }) {
  const shareURLData = {
    url: window.location.toString(),
    description: blog.blogDescription,
  };

  return (
    <Modal>
      <div className={styles.wrapper}>
        <div className={styles.head}>
          <p className={styles.headTitle}>Share</p>

          <button className={styles.closeBtn} onClick={onClose}>
            <FaTimes width="1em" fontSize="1.5rem" />
          </button>
        </div>

        <div className={styles.body}>
          {/* <p>Share you blog in single click</p> */}

          <div>
            <a
              href={shareURL.facebook(shareURLData)}
              target="_blank"
              rel="noreferrer noopener"
            >
              <img className={styles.icon} src={FacebookIcon} alt="facebook" />
            </a>

            <a
              href={shareURL.linkedin(shareURLData)}
              target="_blank"
              rel="noreferrer noopener"
            >
              <img className={styles.icon} src={LinkedinIcon} alt="linkedin" />
            </a>

            <a
              href={shareURL.twitter(shareURLData)}
              target="_blank"
              rel="noreferrer noopener"
            >
              <img className={styles.icon} src={TwitterIcon} alt="twitter" />
            </a>

            <a
              href={shareURL.whatsapp(shareURLData)}
              target="_blank"
              rel="noreferrer noopener"
            >
              <img className={styles.icon} src={WhatsappIcon} alt="whatsapp" />
            </a>
          </div>

          <p className={styles.urlWrapper}>
            <span className={styles.url}>{window.location.toString()}</span>

            <Tooltip tip="Copied!!!">
              <button
                className={styles.copyBtn}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.toString());
                }}
              >
                Copy
              </button>
            </Tooltip>
          </p>
        </div>
      </div>
    </Modal>
  );
}
