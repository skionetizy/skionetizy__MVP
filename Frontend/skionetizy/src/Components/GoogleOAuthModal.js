import Modal from "./Modal";
import React, { useEffect, useState } from "react";
import { createAuthURL } from "../auth/googleOauth";
import { FcGoogle } from "react-icons/fc";
import styles from "./GoogleOAuthModal.module.css";
import { useLocation } from "react-router-dom";
import { sendGoogleAuthCode } from "../API/oauthAPIHandler";
import Spinner from "./Spinner";

function GoogleOAuthModal({ currentBlog }) {
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const googleOAuthURL = createAuthURL("/auth/authToken", {
    utmSource: "blog",
    redirectURL: window.location.pathname,
  });
  const { state } = useLocation();

  useEffect(() => {
    const { callbackURL } = state || {};
    if (callbackURL) {
      setIsVisible(true);
      setStatus("loading");
      sendGoogleAuthCode({ callbackURL })
        .then((userData) => {
          const { userID } = userData.user;
          localStorage.setItem("userID", JSON.stringify(userID));
          // localStorage.setItem("profileID", JSON.stringify(profileID));

          // clearing react router state
          window.history.replaceState({}, document.title);
          setStatus("success");

          setTimeout(() => {
            setIsVisible(false);
          }, 2000);
        })
        .catch((error) => {
          if (!error.isAxiosError) throw error;

          setStatus("error");
          setError(
            error.response?.data.message ||
              JSON.stringify({ response: error.response?.data }, null, 4)
          );

          console.info(error);
        });
    } else {
      setTimeout(() => {
        setIsVisible(true);
      }, 8000);
    }
  }, [state]);

  useEffect(() => {
    if (isVisible) {
      document.body.classList.add("noscroll");
    }
    return () => document.body.classList.remove("noscroll");
  }, [isVisible]);

  return isVisible ? (
    <Modal>
      <div className={styles.wrapper}>
        {status === "loading" ? (
          <div>
            <Spinner />
            &nbsp; &nbsp; Verifying your Credientials{" "}
            <span className="ani-typing">...</span>
          </div>
        ) : status === "error" ? (
          <p>{error}</p>
        ) : status === "success" ? (
          <p>Login Successful</p>
        ) : (
          <>
            <p>Skionetizy</p>
            <p>You missing most of our features. Login in with one click</p>

            <a
              href={googleOAuthURL}
              className={styles.googleBtn}
              onClick={() => {
                localStorage.setItem(
                  "GOOGLE_OAUTH_CURRENT_BLOG",
                  JSON.stringify(currentBlog)
                );
              }}
            >
              <FcGoogle width="1em" fontSize="2rem" />
            </a>
          </>
        )}
      </div>
    </Modal>
  ) : null;
}

export default GoogleOAuthModal;
