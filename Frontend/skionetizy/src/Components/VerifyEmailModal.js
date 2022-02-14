import React from "react";
import styles from "./VerifyEmailModal.module.css";
import Modal from "./Modal";
import OpenedEnvelope from "../Assets/opened_envelope_with_green_check.png";
import LogoIcon from "../Assets/logo-new.svg";


function VerifyEmailModal({ onClose, isForgotPassword }) {
  return (
    <Modal>
      <div className={styles.wrapper}>
        <p className={styles.verifyModalLogo}>
          <img
            className={styles.verifyModalLogoImg}
            src={LogoIcon}
            alt="fountain pen's tip camera closeup"
          />
          Papersdrop
        </p>
        <img
          className={styles.image}
          src={OpenedEnvelope}
          alt="opened envelope with huge green check mark on white paper inside"
        />
        {
          isForgotPassword ?
            <p className={styles.para}>
              The link to change you password is shared to you on your Email. Please check your Inbox!
            </p>

            : <p className={styles.para}>
              Thanks for been part of skionetizy please check your Email to Verify
              your Account
            </p>
        }
        <button className={styles.btn} type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
}

export default VerifyEmailModal;
