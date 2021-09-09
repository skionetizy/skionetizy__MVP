import React from "react";
import styles from "./Divider.module.css";
import clsx from "../utils/clsx";

export default function Divider({ className, children }) {
  return (
    <p className={clsx(className, styles.divider)}>
      <span>{children}</span>
    </p>
  );
}
