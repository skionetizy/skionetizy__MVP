import React from "react";
import styles from "./VerifyEmailModal.module.css";
import Modal from "./Modal";
import OpenedEnvelope from "../Assets/opened_envelope_with_green_check.png";

function VerifyEmailModal({ onClose }) {
  return (
    <Modal>
      <div className={styles.wrapper}>
        <p className={styles.title}>Logo</p>

        <img
          className={styles.image}
          src={OpenedEnvelope}
          alt="opened envelope with huge green check mark on white paper inside"
        />

        <p className={styles.para}>
          Over 500+ people have logged in Over 500+ people have logged in Over
          500+ people have logged in
        </p>

        <button className={styles.btn} type="button" onClick={onClose}>
          Verified
        </button>
      </div>
    </Modal>
  );
}

export default VerifyEmailModal;
