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
  isExternalLink = false,
  outline,
  ...props
}) {
  const design = clsx(
    outline && styles.outline,
    styles[variant],
    styles[size],
    className,
    styles.base
  );

  if (link === true && isExternalLink === false) {
    return (
      <Link className={design} {...props}>
        {children}
      </Link>
    );
  } else if (link === true && isExternalLink === true) {
    return (
      <a className={design} {...props} href={props.to}>
        {children}
      </a>
    );
  } else
    return (
      <button
        className={design}
        type="button"
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Spinner className={styles.loadingIcon} />}
        {children}
      </button>
    );
}
