import React from "react";
import { FaTimes } from "react-icons/fa";
import clsx from "../utils/clsx";
import styles from "./Modal.module.css";

export default function Modal({ className, children }) {
  return <div className={`${styles.wrapper} ${className}`}>{children}</div>;
}

function ModalHead({ className, onClose, showCloseBtn = true, children } = {}) {
  return (
    <div className={styles.head}>
      <p className={styles.headTitle}>{children}</p>

      {showCloseBtn && (
        <button className={styles.closeBtn} onClick={onClose}>
          <FaTimes width="1em" fontSize="1.5rem" />
        </button>
      )}
    </div>
  );
}

function ModalBody({ className, ...props }) {
  return <div className={clsx(className, styles.body)} {...props} />;
}

Modal.Head = ModalHead;
Modal.Body = ModalBody;
