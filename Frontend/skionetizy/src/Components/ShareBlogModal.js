import React from "react";
import styles from "./ShareBlogModal.module.css";
import Modal from "./Modal";
import { FaTimes } from "react-icons/fa";
import Tooltip from "../Components/Tooltip";

export default function ShareBlogModal({ onClose }) {
  return (
    <Modal>
      <div className={styles.wrapper}>
        <button className={styles.closeBtn} onClick={onClose}>
          <FaTimes width="1em" fontSize="1.5rem" />
        </button>

        <div className={styles.body}>
          <p>Share you blog in single click</p>

          <Tooltip tip="Copied">
            <button
              className={styles.copyBtn}
              onClick={() => {
                navigator.clipboard.writeText(window.location.toString());
              }}
            >
              Click to Copy URL
            </button>
          </Tooltip>
        </div>
      </div>
    </Modal>
  );
}
