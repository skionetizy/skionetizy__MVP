import React from "react";
import styles from "./BlogSteps.module.css";
import clsx from "../utils/clsx";

function BlogSteps({ noOfSteps, currentStep }) {
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
            >
              {idx + 1}
            </p>
          </>
        ))}
    </div>
  );
}

export default BlogSteps;
