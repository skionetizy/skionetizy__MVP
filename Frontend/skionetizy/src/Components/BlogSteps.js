import React from "react";
import styles from "./BlogSteps.module.css";
import clsx from "../utils/clsx";
import { useHistory, useLocation } from "react-router-dom";

function noop() {}

const stepsPathMap = {
  1: "/addBlogDetailsMarkdown",
  2: "/addBlogImage",
  3: "/addBlogKeywords",
};

function BlogSteps({ noOfSteps, currentStep, onStepClick = noop }) {
  const history = useHistory();
  const location = useLocation();

  return (
    <div className={styles.wrapper}>
      {Array(noOfSteps)
        .fill()
        .map((_, idx) => (
          <>
            {!!idx && (
              <>
                <p className={styles.dots}></p>
                <p className={styles.dots}></p>
                <p className={styles.dots}></p>
              </>
            )}

            <p
              className={clsx(
                styles.stepCircle,
                currentStep === idx + 1 && styles.active
              )}
              onClick={() => {
                const path = stepsPathMap[idx + 1];
                history.push(path, location.state);
              }}
            >
              {idx + 1}
            </p>
          </>
        ))}
    </div>
  );
}

export default BlogSteps;
