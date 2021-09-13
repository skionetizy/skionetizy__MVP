import axios from "axios";
import { React, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiArrowRight } from "react-icons/fi";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import * as yup from "yup";
import AddUserRafikiImage from "../Assets/add_user_rafiki.svg";
import { createAuthURL } from "../auth/googleOauth";
import styles from "./SignupForm.module.css";
import baseURL from "../utils/baseURL";
import createFlaskError from "../utils/createFlaskError";
import Spinner from "./Spinner";
import Divider from "./Divider";
import clsx from "../utils/clsx";
import noop from "../utils/noop";

const googleOAuthURL = createAuthURL("/auth/authToken");
function SignupForm({ className, onLoginClick = noop, onSignup = noop }) {
  const [emailID, setEmailID] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const url = `${baseURL}/signup`;

      await yup
        .string()
        .required("Email is required")
        .email("Enter a valid email address")
        .validate(emailID);

      setError("");

      const payload = {
        emailID: emailID,
        firstName: emailID.replace(/\./g, "_").split("@")[0],
        lastName: "",
      };

      setIsLoading(true);
      const res = await axios.post(`${url}`, payload);

      if (res.data.statusCode === 500) {
        throw createFlaskError(res.data.message);
      }

      onSignup(res.data, null);
      setIsLoading(false);
    } catch (error) {
      let errorMessage;
      if (error instanceof yup.ValidationError) {
        errorMessage = error.message;
      } else if (error.isFlaskError) {
        errorMessage = error.message;
      } else if (error.isAxiosError) {
        errorMessage = error?.response.data.message || "Server Error";
      }

      // expected message
      if (errorMessage) {
        onSignup(null, errorMessage);
        setError(errorMessage);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className={clsx(className, styles.wrapper)}>
      <h1 className={styles.title}>SIGNUP</h1>
      <img className={styles.heroImage} src={AddUserRafikiImage} alt="" />
      <p className={styles.lead}>
        Cheese and biscuits halloumi cauliflower cheese cottage cheese swiss
        boursin fondue caerphilly. Cow port-salut camembert de normandie
        macaroni cheese feta who moved my cheese babybel boursin.
      </p>
      <a className={styles.googleBtn} href={googleOAuthURL}>
        <FcGoogle fontSize="1.5em" /> Signup With Google
      </a>

      <Divider>OR SIGNUP WITH</Divider>

      <form className={styles.emailInputWrapper} onSubmit={handleSubmit}>
        <input
          className={styles.emailInput}
          placeholder="Enter Email ID"
          name="emailID"
          value={emailID}
          onChange={(ev) => setEmailID(ev.target.value)}
        />

        <button className={styles.emailSubmitBtn}>
          {isLoading ? <Spinner /> : <FiArrowRight width="1em" />}
        </button>
      </form>
      <p className={styles.error}>{error || <>&nbsp;</>}</p>

      <p className={styles.loginLinkWrapper}>
        Already have an account,{" "}
        <Link
          className={styles.loginLink}
          to="/login"
          onClick={(ev) => {
            if (onLoginClick != noop) {
              ev.preventDefault();
              onLoginClick();
              return;
            }
          }}
        >
          Login
        </Link>
      </p>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveUserDetails: (...userDetails) =>
      // console.log({userDetialsInDispatchSignup:userDetails})
      dispatch({
        type: "SAVE_USER_DETAILS_AFTER_SIGNUP",
        payload: userDetails,
      }),
  };
};

export default connect(null, mapDispatchToProps)(SignupForm);
