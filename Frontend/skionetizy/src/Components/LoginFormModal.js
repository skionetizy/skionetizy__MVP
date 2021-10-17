import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Vector from "../Assets/bro.svg";
import { createAuthURL } from "../auth/googleOauth";
import useAuth from "../hooks/useAuth";
import LoginForm from "./LoginForm";
import styles from "./LoginFormModal.module.css";
import Modal from "./Modal";
import Spinner from "./Spinner";

function LoginFormModal({ ...props }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const googleOAuthURL = createAuthURL("/auth/authToken", {
    utmSource: "blog",
    redirectURL: window.location.pathname,
  });
  const { googleOAuth } = useAuth();
  const { state } = useLocation();

  useEffect(() => {
    const { callbackURL } = state || {};
    if (callbackURL) {
      // clearing react router state
      window.history.replaceState({}, document.title);
      setStatus("loading");
      googleOAuth({ callbackURL })
        .then((userData) => {
          const { userID, emailID } = userData.user;
          const profileID = userData.profile?.profileID;
          localStorage.setItem("userID", JSON.stringify(userID));
          localStorage.setItem(
            "profileUserName",
            JSON.stringify(emailID.replace(/\./g, "_").split("@")[0])
          );
          localStorage.setItem("profileID", profileID);
          setStatus("success");
          props.onLogin?.(userData, null);
        })
        .catch((error) => {
          if (!error.isAxiosError) throw error;

          setStatus("error");
          setError(
            error.response?.data.message ||
              JSON.stringify({ response: error.response?.data }, null, 4)
          );

          props.onLogin?.(null, error);
          console.info(error);
        });
    }
  }, [state]);

  // useEffect(() => {
  //   if (isVisible) {
  //     document.body.classList.add("noscroll");
  //   }
  //   return () => document.body.classList.remove("noscroll");
  // }, [isVisible]);

  return (
    <Modal>
      <div className={styles.wrapper}>
        {status === "loading" ? (
          <div>
            <Spinner />
            &nbsp; &nbsp; Verifying your Credientials{" "}
            <span
              style={{ "--background": "var(--primary-blue)" }}
              className="ani-typing"
            >
              ...
            </span>
          </div>
        ) : status === "error" ? (
          <p className={styles.error}>{error}</p>
        ) : status === "success" ? (
          <p>Login Successful</p>
        ) : (
          <>
            <div className={styles.loginWrapper}>
              <div className={styles.imageWrapper}>
                <h1 className={styles.title}>Login</h1>
                <p className={styles.lead}>
                  Over 500+ people have logged in Over 500+ people have logged
                  in Over 500+ people have logged in
                </p>
                <img className={styles.image} src={Vector} alt="" />
              </div>

              <div className={styles.loginForm}>
                <LoginForm {...props} googleOAuthURL={googleOAuthURL} />
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

export default LoginFormModal;
