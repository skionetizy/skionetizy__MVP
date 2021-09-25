import React from "react";
import styles from "./FrameBorder.module.css";
import clsx from "../utils/clsx";

function FrameBorder({ title, className, children }) {
  return (
    <>
      <div className={clsx(styles.divider, className)}>{title}</div>
      {children}
      <div className={clsx(styles.bottomDivider, className)}></div>
    </>
  );
}

export default FrameBorder;
