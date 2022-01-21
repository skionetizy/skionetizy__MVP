import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { getBlogsAndProfileDetails } from "../API/blogAPIHandler";
import { sendLogin } from "../API/userAPIHandler";
import { createAuthURL } from "../auth/googleOauth";
import Button from "../Components/Button";
import Divider from "../Components/Divider";
import useForm from "../hooks/useForm";
import useMutate from "../hooks/useMutate";
import noop from "../utils/noop";
import style from "./LoginForm.module.css";
import ReverifyEmail from "./ReverifyEmail";
import baseURL from "../utils/baseURL";
import * as yup from "yup";
import createFlaskError from "../utils/createFlaskError";
import VerifyEmailModal from "../Components/VerifyEmailModal";
import { connect } from "react-redux";
import { sendGoogleLoginResp } from "../API/oauthAPIHandler";
import {
  getHoverProfileDetails,
  getProfileDetailsAPIHandler,
} from "../API/profileAPIHandler";
import {
  AUTHORIZATION_HEADER,
  LOGGED_IN_PROFILE_ID,
} from "../utils/localStorageKeys";
import { GoogleLogin } from "react-google-login";


const CLIENT_ID="765275654524-e5fed4uno6flsogkjj3lurlk4l5hoo3p.apps.googleusercontent.com";

//const defaultGoogleOauthURL = createAuthURL("/auth/authToken");

function LoginForm(props, {
  // googleOAuthURL = defaultGoogleOauthURL,
  // onLogin = noop,
  onSignupClick,
}) {
  const { data: details, handleChange } = useForm({
    emailID: "",
    password: "",
  });
  const history = useHistory();
  // const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /* useEffect(() => {
     console.log("useEffect props.isLogin ->", props.isLogin)
     console.log("useEffect props.jwtToken ->", props.jwtToken)
   }, [props.jwtToken]) */
   useEffect(()=>{
     console.log(props)
    if(props.isLogin===true){
      history.push("/")
      return;
    }
   },[props])

  const handleSubmit = async (e) => {
    e.preventDefault();
    // try {
    if (details) {
      await yup
        .string()
        .required("Email is required")
        .email("Enter a valid email address")
        .validate(details.emailID);
      setIsLoading(true)

      const res = await sendLogin(details);
      if (res.status !== 200) {
        setError(res.message)
        setIsLoading(false);
        return
      }
      // console.log("res inside useAuth", res);
      const { profileID, token } = res;
      // axios.defaults.headers["Authorization"] = token;
      // set them in localstorage
      localStorage.setItem(AUTHORIZATION_HEADER, token);
      localStorage.setItem(LOGGED_IN_PROFILE_ID, profileID);
      // console.log("Inside login before saveProfile ->", profileID);
      // get updated profile from the ID
      const { profileUserName } = await getHoverProfileDetails(profileID);
      const profile_get = await getProfileDetailsAPIHandler(profileUserName);
      props.on_login(res.token, profile_get.profile)
      setIsLoading(false);
      if (res.status === 200) {
        history.push("/")
        return
      } else {
        setError(res.message)
      }

      // else if (res.status === 500 || res.statusCode === 500 || res.data.statusCode === 500) {
      //   console.log("Throwing Flask error")
      //   throw createFlaskError(res.data.message);
      // } else {
      //   setShowModal(true)
      // }
    }
    // } catch (error) {
    //   let errorMessage;
    //   setIsLoading(false);
    //   if (error instanceof yup.ValidationError) {
    //     errorMessage = error.message;
    //     console.log("YUP error ->", errorMessage)
    //   } else if (error.isFlaskError) {
    //     errorMessage = error.message;
    //     console.log("Flask Error ->", errorMessage)
    //   } else if (error.isAxiosError) {
    //     errorMessage = error?.response.data.message || "Server Error";
    //     console.log("Error", error?.response.data.message);
    //   }
    // }
  };

  const responseGoogleError=(error)=>{
    console.log(error)
    setError(error.message);
  }
  const responseGoogleSuccess=async(response)=>{
    setIsLoading(true)
    // send response to the backend and get profile and token
    const res = await sendGoogleLoginResp(response);
    const { profile, token } = res;
    // set them in localstorage
    localStorage.setItem(AUTHORIZATION_HEADER, token);
    localStorage.setItem(LOGGED_IN_PROFILE_ID, profile.profileID);
    const profileID=profile.profileID;
    // get updated profile from the ID
    const { profileUserName } = await getHoverProfileDetails(profileID);
    const profile_get = await getProfileDetailsAPIHandler(profileUserName);
    // update the store using action
    props.on_login(res.token, profile_get.profile);
    setIsLoading(false);
    if (res.sucess === true || res.success===1) {
      history.push("/")
      return
    } else {
      setError(res.message)
    }
  }

  return (
    <>
      {/* <Divider className={style.divider}>OR</Divider> */}
      <div>
        {/* <a className={style.googleBtn} href={googleOAuthURL}>
          <FcGoogle fontSize="1.5rem" /> Login with Google
        </a> */}
        <div className={style.googleBtn}>
          <GoogleLogin
            clientId={CLIENT_ID}
            buttonText="Login with Google"
            onSuccess={(response)=>responseGoogleSuccess(response)}
            onFailure={responseGoogleError}
            /* isSignedIn={true} */
            cookiePolicy={"single_host_origin"}
          />
        </div>
        <Divider className={style.divider}>OR</Divider>
        <div>
          <form className={style.signin_form} onSubmit={handleSubmit}>
            <div className={style.email_password}>
              <input
                type="email"
                name="emailID"
                placeholder=" Email"
                onChange={handleChange}
                value={details.emailID}
                className={style.email}
                required
              />
              <input
                type="password"
                name="password"
                placeholder=" Password"
                onChange={handleChange}
                value={details.password}
                className={style.password}
                required
              />
            </div>

            <Link className={style.forgotPasswordLink} to="/forgotPassword">
              Forgot Password
            </Link>


            <ReverifyEmail emailID={details.emailID} />

            <Button
              className={style.signinButton}
              variant="dark"
              size="normal"
              isLoading={isLoading}
              type="submit"
            >
              Login
              <FontAwesomeIcon icon={faSignInAlt} />
            </Button>
          </form>
          {!!error && <p className={style.error}>{error}</p>}

          <p className={style.signupLink}>
            Don't have an account?{" "}
            <a
              href="/signup"
              onClick={(ev) => {
                ev.preventDefault();
                if (onSignupClick) {
                  onSignupClick();
                } else history.push("/signup");
              }}
            >
              Signup
            </a>
          </p>
        </div>
      </div>
      {/* {
        showModal === 'VERFY_EMAIL' && (
          <VerifyEmailModal onClose={() => setShowModal('')} />
        )
      } */}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    isLogin: state.isLogin,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    on_login:(token, profile)=>dispatch({
        type: "SAVE_JWT_PROFILE_AFTER_LOGIN", 
        jwtToken: token,
        profile: profile
    })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);