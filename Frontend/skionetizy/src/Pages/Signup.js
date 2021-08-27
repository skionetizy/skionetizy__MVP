import { React, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

import Signupvec from "../Assets/signupvec.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import style from "../Pages/signup.module.css";
import bgsignup from "../Assets/bgsignup.svg";

import {
  Link,
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { connect } from "react-redux";
import { getTokens } from "../auth/googleOauth";
import { sendGoogleAuthCode } from "../API/oauthAPIHandler";

function Signup(props) {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    emailID: "",
    password: "",
    confirmPassword: "",
    userID: "",
  });
  const [error, setError] = useState("");
  // const [formvalues,setformValues]=useState();

  const handleChange = (e) => {
    e.preventDefault();
    const inpname = e.target.name;
    const inpvalue = e.target.value;

    setValues({ ...values, [inpname]: inpvalue });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (values.firstName.length < 5) {
      alert("Less characters in firstname (minimum length 6)");
      setValues({ ...values, firstName: "" });
      return;
    }
    if (values.password !== values.confirmPassword) {
      alert("Password and confirm password do not match");
      setValues({ ...values, password: "", confirmPassword: "" });
      return;
    }
    // console.log(values);
    const url = "http://127.0.0.1:5000/signup";

    axios
      .post(`${url}`, values)
      .then((res) => {
        // console.log(res.data);
        setValues({ ...values, userID: res.data.userID });
      })
      .catch((err) => console.log(err));
    props.saveUserDetails(values.userID, values.firstName, values.lastName);
    // <Route exact path="/">
    //   {loggedIn ? <Redirect to="/dashboard" /> : <PublicHomePage />}
    // </Route>;

    values.userID && <Redirect to="/details" />;

    setValues({
      ...values,
      firstName: "",
      lastName: "",
      emailID: "",
      password: "",
      confirmPassword: "",
    });
  };

  useEffect(() => {
    console.log(window.location.toString());
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
      {" "}
      <div className={`${style.container} ${style.cover}`}>
        <div className={`${style.container} ${style.signup}`}>
          <div className={style.header}>
            <h1 className={style.header_heading}>Sign up</h1>
            <p className={style.header_text}>
              Enter your details to create a free account
            </p>
          </div>
          <div className={style.signup_container}>
            <form className={style.signup_form} onSubmit={handleSubmit}>
              <div className={style.name}>
                <input
                  type="text"
                  className={style.name_firstName}
                  onChange={handleChange}
                  name="firstName"
                  placeholder=" First Name"
                  required
                />
                <input
                  type="text"
                  className={style.name_lastName}
                  onChange={handleChange}
                  name="lastName"
                  placeholder=" Last Name"
                  required
                />
              </div>
              <div className={style.email_password}>
                <input
                  type="email"
                  name="emailID"
                  placeholder=" Email"
                  onChange={handleChange}
                  className={style.email}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder=" Password"
                  onChange={handleChange}
                  className={style.password}
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder=" Confirm Password"
                  onChange={handleChange}
                  className={style.confirmPassword}
                  required
                />
              </div>
              <button className={style.signupButton} type="submit">
                Sign up
                <FontAwesomeIcon icon={faSignInAlt} />
              </button>
            </form>
            <div className={style.loginLink}>
              <p>Already have an account?</p>
              <span>
                <Link to="/login">Login</Link>
              </span>
            </div>
          </div>
        </div>
        <div className={style.coverImage}>
          <img src={bgsignup} alt="" className={style.coverImage_svg} />
        </div>
      </div>
      {/* Error Message */}
      {error ? (
        <div
          onAnimationEnd={() => {
            // clear error message after animation ends
            setError("");
          }}
          className={style.errorWrapper}
        >
          <p>There was an error:</p>
          <p>"{error}"</p>
        </div>
      ) : null}
    </>
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

export default connect(mapDispatchToProps)(Signup);
