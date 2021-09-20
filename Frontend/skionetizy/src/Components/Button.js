import React from "react";
import styles from "./Button.module.css";
import clsx from "../utils/clsx";
import Spinner from "./Spinner";

export default function Button({
  isLoading,
  disabled,
  variant = "primary",
  size = "normal",
  className,
  children,
  ...props
}) {
  return (
    <button
      className={clsx(styles[variant], styles[size], className, styles.base)}
      type="button"
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner className={styles.loadingIcon} />}
      {children}
    </button>
  );
}
