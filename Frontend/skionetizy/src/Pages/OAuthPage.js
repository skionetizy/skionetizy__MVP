import React, { useEffect, useLayoutEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Spinner from "../Components/Spinner";
import useAuth from "../hooks/useAuth";
import styles from "./OAuth.module.css";

export default function OAuthPage() {
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");
  const history = useHistory();
  const { googleOAuth } = useAuth();

  useLayoutEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const { utmSource, redirectURL } = JSON.parse(params.get("state") || "{}");
    if (utmSource === "blog") {
      history.push(redirectURL, { callbackURL: window.location.toString() });
    }
  }, [history]);

  useEffect(() => {
    const callbackURL = window.location.toString();

    setStatus("loading");
    googleOAuth({ callbackURL })
      .then(({ user, profile }) => {
        setStatus("success");

        setTimeout(() => {
          history.push("/");
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
  }, [history]);

  return (
    <>
      <div className={styles.wrapper}>
        <div>
          {status === "idle" ? (
            <p>. . .</p>
          ) : status === "error" ? (
            <div className={styles.errorWrapper}>
              <p>There was an error:</p>
              <p>"{error}"</p>
            </div>
          ) : status === "loading" ? (
            <p>
              <Spinner className={styles.spinner} /> Validating your details . .
              .
            </p>
          ) : status === "success" ? (
            <>
              <p>Login Successful.</p>
              <small>Redirecting . . .</small>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
