import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { getBlogsAndProfileDetails } from "../API/blogAPIHandler";
import { sendLogin } from "../API/userAPIHandler";
import { createAuthURL } from "../auth/googleOauth";
import Button from "../Components/Button";
import Divider from "../Components/Divider";
import useAuth from "../hooks/useAuth";
import useForm from "../hooks/useForm";
import useMutate from "../hooks/useMutate";
import { AUTH } from "../store/reducer";
import { AUTHORIZATION_HEADER } from "../utils/localStorageKeys";
import noop from "../utils/noop";
import style from "./LoginForm.module.css";
import ReverifyEmail from "./ReverifyEmail";
import baseURL from "../utils/baseURL";
import * as yup from "yup";
import createFlaskError from "../utils/createFlaskError";
import VerifyEmailModal from "../Components/VerifyEmailModal";




const defaultGoogleOauthURL = createAuthURL("/auth/authToken");

export default function LoginForm({
  googleOAuthURL = defaultGoogleOauthURL,
  onLogin = noop,
  onSignupClick,
}) {
  const { data: details, handleChange } = useForm({
    emailID: "",
    password: "",
  });
  const history = useHistory();
  const dispatch = useDispatch();
  const { login } = useAuth();
  const [showModal, setShowModal] = useState('');


  // const loginMutation = useMutate({
  //   mutateFn: async (data) => {
  //     console.log("dt", data)
  //     const response = await login(details);
  //     //console.log(response);
  //     return response;
  //   },

  //   onSuccess: (profileID) => {
  //     onLogin(profileID, null);
  //   },

  //   onFailure: (error) => {
  //     onLogin(null, error);
  //   },
  // });

  // const { isLoading } = loginMutation;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${baseURL}/login`;
    // try {
    if (details) {
      // loginMutation.mutate(details, e);
      // onLogin(res.profileID, null);
      // Change here
      await yup
        .string()
        .required("Email is required")
        .email("Enter a valid email address")
        .validate(details.emailID);
      setIsLoading(true)
      const res = await login(details)
      setIsLoading(false);
      console.log("Inside LoginForm res after login()-> ", res)
      console.log("res.status", res.status)

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
  return (
    <>
      <div>
        <a className={style.googleBtn} href={googleOAuthURL}>
          <FcGoogle fontSize="1.5rem" /> Login with Google
        </a>
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
