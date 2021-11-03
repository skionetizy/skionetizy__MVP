import React, { useEffect } from "react";
import useIntersectionObserver from "../hooks/useIntersectionObserver";

export default function TriggerLoginPopup({ onVisible, ...props }) {
  const { isVisible, targetRef } = useIntersectionObserver();

  useEffect(() => {
    onVisible?.(isVisible);
  }, [isVisible]);

  return <span ref={targetRef} {...props}/>;
}
