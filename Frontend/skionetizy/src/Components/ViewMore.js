import React, { useEffect } from "react";
import styles from "./ViewMore.module.css";
import useIObserver from "../hooks/useIntersectionObserver";
import clsx from "../utils/clsx";

function ViewMore({ onVisiblityChange, className }) {
  const viewMore = useIObserver();

  useEffect(() => {
    onVisiblityChange(viewMore.isVisible);
  }, [viewMore.isVisible]);

  return (
    <span ref={viewMore.targetRef} className={clsx(className, styles.viewMore)}>
      view more span target. js uses it to detect when user has scroll to bottom
      to this span and then fetch more blogs. this span is visually hidden using
      css
    </span>
  );
}
export default ViewMore;
