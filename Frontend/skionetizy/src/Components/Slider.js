import React, { useRef } from "react";
import styles from "./Slider.module.css";
import clsx from "../utils/clsx";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Slider({ children }) {
  /** @type {{current: HTMLDivElement}} */
  const sliderRef = useRef();

  function slide(xAxis) {
    sliderRef.current.scrollLeft += xAxis * window.innerWidth * 0.8;
  }

  return (
    <div className={styles.relative}>
      <div ref={sliderRef} className={styles.wrapper}>
        {children}

        <button
          className={clsx(styles.icon, styles.icon_left)}
          onClick={() => slide(-1)}
        >
          <FaChevronLeft />
        </button>

        <button
          className={clsx(styles.icon, styles.icon_right)}
          onClick={() => slide(1)}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}
