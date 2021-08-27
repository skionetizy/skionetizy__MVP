import React, { useEffect, useState } from "react";
import { sendGoogleAuthCode } from "../API/oauthAPIHandler";
import Spinner from "../Components/Spinner";
import styles from "./OAuth.module.css";

export default function OAuthPage() {
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const googleOAuthCode = params.get("code");
    const callbackURL = window.location.toString();

    if (googleOAuthCode) {
      sendGoogleAuthCode({ callbackURL })
        .then((userData) => {
          const { jwt } = userData;
          localStorage.setItem("auth_token", jwt);
          localStorage.setItem("userData", JSON.stringify(userData));
        })
        .catch((error) => {
          if (!error.isAxiosError) throw error;

          setError(error.response?.data.message);
          console.info(error);
        });
    }
  }, []);

  return (
    <>
      <div className={styles.wrapper}>
        <div>
          {error ? (
            <div className={styles.errorWrapper}>
              <p>There was an error:</p>
              <p>"{error}"</p>
            </div>
          ) : (
            <>
              <Spinner className={styles.spinner} /> Validating your details . .
              .
            </>
          )}
        </div>
      </div>
    </>
  );
}
