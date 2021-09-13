import React, { useState } from "react";
import styles from "./PasswordInput.module.css";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "../utils/clsx";

export default function PasswordInput({
  wrapperClassName,
  className,
  ...props
}) {
  const [isShowPassword, setIsShowPassword] = useState(false);

  return (
    <div className={clsx(styles.wrapper, wrapperClassName)}>
      <input
        className={clsx(styles.input, className)}
        type={isShowPassword ? "text" : "password"}
        {...props}
      />

      <button
        className={styles.btn}
        onClick={() => setIsShowPassword((p) => !p)}
        type="button"
      >
        <FontAwesomeIcon icon={isShowPassword ? faEyeSlash : faEye} />
      </button>
    </div>
  );
}
