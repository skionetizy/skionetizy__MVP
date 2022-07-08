import React from "react";
import styles from "./FrameBorder.module.css";
import clsx from "../utils/clsx";
import TuneIcon from '@material-ui/icons/Tune';

function FrameBorder({ title, className, children }) {
  return (
    <>
      <div className={clsx(styles.divider, className)}>
        {title}
        <span className={clsx(styles.filter, className)}>
          <p>Filter By</p>
          <div className={clsx(styles.dropdown)}>
            <TuneIcon className={clsx(styles.dropbtn)} fontSize="large" />
            <div className={clsx(styles.dropdownContent, className)}>
              <a href="#">Old</a>
              <hr />
              <a href="#">New</a>
            </div>
          </div>
        </span>

      </div>
      {children}
      <div className={clsx(styles.bottomDivider, className)}></div>
    </>
  );
}

export default FrameBorder;
