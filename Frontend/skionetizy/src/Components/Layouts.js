import React from "react";
import clsx from "../utils/clsx";
import styles from "./Layouts.module.css";

export function Stack({ spacing, style, className, children, ...props }) {
  return (
    <div
      style={{ "--spacing": spacing, ...style }}
      className={clsx(styles.stack, className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function Center({ className, children, ...props }) {
  return (
    <div className={clsx(styles.center, className)} {...props}>
      {children}
    </div>
  );
}
