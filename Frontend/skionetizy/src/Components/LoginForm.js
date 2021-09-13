import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useHistory } from "react-router-dom";
import { createAuthURL } from "../auth/googleOauth";
import Divider from "../Components/Divider";
import baseURL from "../utils/baseURL";
import style from "./LoginForm.module.css";
import axios from "axios";
import Spinner from "./Spinner";

const defaultGoogleOauthURL = createAuthURL("/auth/authToken");

const noop = () => {};
export default function LoginForm({
  googleOAuthURL = defaultGoogleOauthURL,
  onLogin = noop,
  onSignupClick,
} = {}) {
  const [details, setDetails] = useState({
    emailID: "",
    password: "",
  });
  const [status, setStatus] = useState("idle");
  const history = useHistory();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setDetails({ ...details, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(details);

    // const onLogin = (userID) => {
    //   props.onLogin(userID);
    // };

    setStatus("loading");
    axios
      .post(`${baseURL}/login`, details)
      .then((res) => {
        console.log(res.data);
        if (res.data.status == 200) {
          if (res.data && res.data.user) {
            // localStorage.setItem("userID", JSON.stringify(res.data.user.userID));
            // const userID = res.data.user?.userID;

            // props.onLogin(userID);

            // const profileID = res.data.user?.profileID;
            localStorage.setItem(
              "profileID",
              JSON.stringify(res.data.user.profileID)
            );

            if (res.data.user.profileUserName)
              localStorage.setItem(
                "profileUserName",
                JSON.stringify(res.data.user.profileUserName)
              );
            onLogin(res.data);
          }
        } else {
          console.log(res.data.message);
        }
      })
      .catch((error) => {
        onLogin(null, error);
      })
      .finally(() => {
        setStatus("idle");
      });

    setDetails({
      emailID: "",
      password: "",
    });
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

          <button
            className={style.signinButton}
            type="submit"
            disabled={status === "loading"}
          >
            Login
            {status === "loading" ? (
              <Spinner />
            ) : (
              <FontAwesomeIcon icon={faSignInAlt} />
            )}
          </button>
        </form>
        <p className={style.signupLink}>
          Don't have an account?{" "}
          <a
            href="/"
            onClick={(ev) => {
              ev.preventDefault();
              if (onSignupClick) {
                onSignupClick();
              } else history.push("/");
            }}
          >
            Signup
          </a>
        </p>
      </div>
    </div>
  );
}
