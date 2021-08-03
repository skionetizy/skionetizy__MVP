import React from "react";
import styles from "./Modal.module.css";

export default function Modal({ className, children }) {
  return <div className={`${styles.wrapper} ${className}`}>{children}</div>;
}
