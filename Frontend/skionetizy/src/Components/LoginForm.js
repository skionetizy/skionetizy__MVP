import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React from "react";
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
import { AUTH } from "../store/reducer";
import { AUTHORIZATION_HEADER } from "../utils/localStorageKeys";
import noop from "../utils/noop";
import style from "./LoginForm.module.css";

const defaultGoogleOauthURL = createAuthURL("/auth/authToken");

export default function LoginForm({
  googleOAuthURL = defaultGoogleOauthURL,
  onLogin = noop,
  onSignupClick,
} = {}) {
  const { data: details, handleChange } = useForm({
    emailID: "",
    password: "",
  });
  const history = useHistory();
  const dispatch = useDispatch();

  const loginMutation = useMutate({
    mutateFn: async () => {
      const { token } = await sendLogin(details);

      localStorage.setItem(AUTHORIZATION_HEADER, token);
      axios.defaults.headers["Authorization"] = token;

      const { profile } = await getBlogsAndProfileDetails();
      return profile;
    },

    onSuccess: (profile) => {
      dispatch({
        type: AUTH.SAVE_PROFILE,
        payload: profile,
      });
      onLogin(profile, null);
    },

    onFailure: (error) => {
      onLogin(null, error);
    },
  });

  const { isLoading } = loginMutation;

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
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
  );
}
