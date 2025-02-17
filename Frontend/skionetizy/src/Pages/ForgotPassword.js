import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import PasswordInput from "../Components/PasswordInput";
import styles from "./ForgotPassword.module.css";
import EmailEnvelopeImage from "../Assets/close_mail_envelope.png";
import ForgotPasswordSS from "../Assets/forgot_password.png";

function ForgotPassword() {
  function handleEmailSubmit() {}

  function handlePasswordSubmit() {}

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Forgot Password</h1>

      <section className={styles.flex}>
        <div className={styles.imageFlexItem}>
          <img
            className={styles.heroImage}
            src={ForgotPasswordSS}
            alt="forgot password page screen shot with key pic on top "
          />
        </div>

        <div className={styles.formsFlexItem}>
          <form className={styles.emailForm} onSubmit={handleEmailSubmit}>
            <input className={styles.emailInput} placeholder="Enter Email" />
            <button className={styles.emailVerifyBtn} type="submit">
              Verify
            </button>
          </form>

          <p className={styles.status}>Please check your email</p>

          <p className={styles.emailVerified}>
            <img
              src={EmailEnvelopeImage}
              className={styles.emailEnvelopeImg}
              alt="closed mail envelope"
            />
            Email Verified
          </p>

          <form className={styles.passwordForm} onSubmit={handlePasswordSubmit}>
            <PasswordInput
              wrapperClassName={styles.input}
              placeholder="New Password"
            />

            <PasswordInput
              wrapperClassName={styles.input}
              placeholder="Confirm New Password"
            />

            <button className={styles.loginBtn} type="submit">
              Login <FontAwesomeIcon icon={faSignInAlt} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default ForgotPassword;
