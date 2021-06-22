import React, { useState } from "react";
import { connect } from "react-redux";
import {
  Link,
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import style from "../index.module.css";
import axios from "axios";
import Vector from "../Assets/bro.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";

import baseURL from "../utils/baseURL";

// const url = "http://127.0.0.1:5000/login"; //add url here
function Login(props) {
  const [details, setDetails] = useState({
    emailID: "",
    password: "",
  });
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setDetails({ ...details, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(details);

    // const url = "http://127.0.0.1:5000/login";

    axios.post(`${baseURL}/login`, details).then((res) => {
      console.log(res.data);
      if (res.data && res.data.user) {
        // onLogin(res.data.user._id.$oid);
        localStorage.setItem("userID", JSON.stringify(res.data.user.userID));
      }

      // console.log({ userID: res.data.userID });
      // console.log(res.data.user._id);
    });

    const onLogin = (userID) => {
      props.onLogin(userID);
    };

    setDetails({
      emailID: "",
      password: "",
    });
  };

  return (
    <div className={`${style.container} ${style.cover_login}`}>
      <div className={style.coverImage_login}>
        <img src={Vector} alt="" className={style.coverImage_svgLogin} />
      </div>
      <div className={`${style.container} ${style.signin}`}>
        <div className={style.header}>
          <h1 className={style.header_heading}>Login</h1>
          <p className={style.header_text}>Login to your account</p>
        </div>
        <div className={style.signin_container}>
          <form className={style.signin_form}>
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
            <button className={style.signupButton} type="submit">
              Login <FontAwesomeIcon icon={faSignInAlt} />
            </button>
          </form>
          <div className={style.signupLink}>
            <p>Don't have an account?</p>
            <span>
              <Link to="/">Signup</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (userID) => dispatch({ type: "SAVE_USER_ID", userID: userID }),
  };
};

const mapStateToProps = (state) => {
  return {
    isLogin: state.isLogin,
    userID: state.userID,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
