import React from "react";
import clsx from "../utils/clsx";
import styles from "./BlogStatusCard.module.css";

export default function BlogStatusBadge({ variant, children }) {
  return (
    <span className={clsx(styles.baseBadge, styles[variant.toLowerCase()])}>
      {children}
    </span>
  );
}
