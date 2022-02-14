import { AdBlockDetectedWrapper } from "adblock-detect-react";
import styles from "./AdBlockerBlocker.module.css";

function AdBlockBlocker() {
  function refreshPage() {
    window.location.reload(false);
  }
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.center}>
          <div className={styles.content}>
            AdBlocker Detected!!
            <br />
            <div className={styles.spancontainer}>
              <span className={styles.spanContent}>
                Welcome Visitor, Sorry for the interruption
                <p>
                  It looks like you're using an ad blocker. That's okay. Who
                  doesn't?
                </p>
                <p>
                  But without advertising-income, we can't keep making this site
                  awesome.
                </p>
              </span>
              <button className={styles.buttonContainer} onClick={refreshPage}>
                I understand, I have disabled my ad blocker. Let me in!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdBlockerBlocker() {
  return (
    <div className="">
      <AdBlockDetectedWrapper>
        <AdBlockBlocker />
      </AdBlockDetectedWrapper>
    </div>
  );
}

export default AdBlockerBlocker;
