import Modal from "./Modal";
import React from "react";
import { createAuthURL } from "../auth/googleOauth";
import { FcGoogle } from "react-icons/fc";
import { FaTimes } from "react-icons/fa";
import styles from "./GoogleOAuthModal.module.css";

const frontendBaseURL = "http://localhost:3000";
const googleOAuthURL = createAuthURL(`${frontendBaseURL}/auth/authToken`);

function GoogleOAuthModal({ onClose }) {
  return (
    <div className={styles.wrapper}>
      <button className={styles.closeBtn} onClick={onClose}>
        <FaTimes width="1em" fontSize="1.5rem" />
      </button>
      <p>Skionetizy</p>
      <p>You missing most of our features. Loggin in with one click</p>

      <a href={googleOAuthURL} className={styles.googleBtn}>
        <FcGoogle width="1em" fontSize="2rem" />
      </a>
    </div>
  );
}

function GoogleOAuthModalWrapper(props) {
  return props.isVisible ? (
    <Modal>
      <GoogleOAuthModal {...props} />
    </Modal>
  ) : null;
}

export default GoogleOAuthModalWrapper;
