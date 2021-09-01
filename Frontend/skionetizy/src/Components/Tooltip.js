import React, { cloneElement, useState } from "react";
import styles from "./Tooltip.module.css";
import clsx from "../utils/clsx";
import { Children } from "react";

// variant
export default function Tooltip({ className, children, tip, ...props }) {
  const child = Children.only(children);
  const [animateClass, setAnimateClass] = useState("");

  return (
    <>
      {!!animateClass && (
        <span
          className={clsx(styles.tooltip, animateClass, className)}
          onAnimationEnd={() => setTimeout(() => setAnimateClass(""), 3000)}
        >
          {tip}
        </span>
      )}

      {cloneElement(child, {
        ...props,
        onClick: (ev) => {
          child.props.onClick?.(ev);
          setAnimateClass("ani-slideUp");
        },
      })}
    </>
  );
}
