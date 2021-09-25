import React from "react";
import styles from "./Button.module.css";
import clsx from "../utils/clsx";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";

export default function Button({
  link,
  isLoading,
  disabled,
  variant = "primary",
  size = "normal",
  className,
  children,
  ...props
}) {
  if (link === true) {
    return (
      <Link
        className={clsx(styles[variant], styles[size], className, styles.base)}
        {...props}
      >
        {children}
      </Link>
    );
  }

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
