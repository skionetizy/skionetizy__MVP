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
import VerifyEmailModal from "../Components/VerifyEmailModal";
import { GoogleLogin } from "react-google-login";
import { sendGoogleLoginResp } from "../API/oauthAPIHandler";
import {
  getHoverProfileDetails,
  getProfileDetailsAPIHandler,
} from "../API/profileAPIHandler";
import {
  AUTHORIZATION_HEADER,
  LOGGED_IN_PROFILE_ID,
  REDIRECTED_FROM,
} from "../utils/localStorageKeys";

const googleOAuthURL = createAuthURL("/auth/authToken");
function SignupForm(props, {
  className,
  onLoginClick = noop,
  // onSignup = noop 
}) {
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

  const [emailID, setEmailID] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const [showModal, setShowModal] = useState("");

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
        redirect_to:"/"
      };
      setIsLoading(true);
      const res = await axios.post(`${url}`, payload);
      if (res.data.statusCode === 500) {
        // throw createFlaskError(res.data.message);
        console.log("Error ->", res.data.message)
        setError(res.data.message)
        alert(res.data.message);
      } else {
        console.log('No error')
        setShowModal("VERIFY_EMAIL");
      }
      // onSignup(res.data, null);
      setIsLoading(false);
    } catch (error) {
      let errorMessage;
      if (error instanceof yup.ValidationError) {
        errorMessage = error.message;
      } else if (error.isFlaskError) {
        errorMessage = error.message;
      } else if (error.isAxiosError) {
        errorMessage = error?.response.data.message || "Server Error";
        console.log("Error ->", error?.response.data.message);
      }

      // expected message
      if (errorMessage) {
        // onSignup(null, errorMessage);
        setError(errorMessage);
      }
      setIsLoading(false);

    }
  };

  const responseGoogleError = (error) => {
    console.log(error)
    setError(error.message);
  }
  const responseGoogleSuccess = async (response) => {
    setIsLoading(true)
    // send response to the backend and get profile and token
    const res = await sendGoogleLoginResp(response);
    console.log("Inside responseGoogleSuccess-> ",res);
    const { profile, token, user:{userID} } = res;
    // set them in localstorage
    localStorage.setItem(AUTHORIZATION_HEADER, token);
    localStorage.setItem(LOGGED_IN_PROFILE_ID, profile.profileID);
    const profileID = profile.profileID;
    // get updated profile from the ID
    const { profileUserName } = await getHoverProfileDetails(profileID);
    const profile_get = await getProfileDetailsAPIHandler(profileUserName);
    // update the store using action
    props.on_signup(res.token, profile_get.profile, userID);
    setIsLoading(false);
    if (res.sucess === true || res.success === 1) {
      history.push(localStorage.getItem(REDIRECTED_FROM) || REDIRECTED_FROM)
      return
    } else {
      setError(res.message)
    }
  }

  return (
    <>
      <div className={clsx(className, styles.wrapper)}>
        <div
          style={{
            display: "flex",
            width: "100%",
          }}
        >
          <h1 className={styles.title}>Signup</h1>
          <img className={styles.heroImage} src={AddUserRafikiImage} alt="" />
        </div>
        <p className={styles.lead}>
          Welcome to PaperDrop, a place to learn, create and share!
        </p>

        <p className={styles.lead}>
          Create your free PaperDrop account to explore all the tools and services
          you need to create seo friendly content. Join us to read what the world
          is writing.
        </p>
        <GoogleLogin
            clientId={CLIENT_ID}
            buttonText="Signup with Google"
            onSuccess={(response) => responseGoogleSuccess(response)}
            onFailure={responseGoogleError}
            /* isSignedIn={true} */
            cookiePolicy={"single_host_origin"}
        />
        {/* <a className={styles.googleBtn} href={googleOAuthURL}>
          <FcGoogle fontSize="1.5em" /> Signup With Google
        </a> */}
        <p className={styles.login_p}>It just takes 3 seconds to login!</p>

        <Divider className={styles.divider}>OR SIGNUP WITH</Divider>

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
        {!!error && <p className={styles.error}>{error}</p>}

        <p className={styles.loginLinkWrapper}>
          Already have an account?{" "}
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
            Log in here
          </Link>
        </p>
      </div>
      {showModal === "VERIFY_EMAIL" && (
        <VerifyEmailModal
          onClose={() => {
            history.push("/login");
          }}
        />
      )}
    </>
  );
}


const mapStateToProps = (state) => {
  console.log("Inside mapStateToProps", state)

  return {
    userID: state.userID,
    firstName: state.firstName,
    lastName: state.lastName,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    on_signup: (token, profile, userID) => dispatch({
      type: "SAVE_JWT_PROFILE_AFTER_LOGIN",
      jwtToken: token,
      profile: profile,
      userID: userID
    })
  };
  // return {
  //   saveUserDetails: (...userDetails) =>
  //     // console.log({userDetialsInDispatchSignup:userDetails})
  //     dispatch({
  //       type: "SAVE_USER_DETAILS_AFTER_SIGNUP",
  //       payload: userDetails,
  //     }),
  // };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignupForm);
// export default SignupForm;
