import React, { useState } from "react";
import { connect } from "react-redux";
import {
  Link,
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import axios from "axios";
import Vector from "../Assets/bro.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";

const url = "http://127.0.0.1:5000/login"; //add url here
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

    const url = "http://127.0.0.1:5000/login";

    axios.post(`${url}`, details).then((res) => {
      console.log(res.data);
      if (res.data && res.data.user) {
        // onLogin(res.data.user._id.$oid);
        localStorage.setItem("userID", JSON.stringify(res.data.userID));
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
    <div className="mainlogin">
      <img src={Vector} alt="image" className="vec1" />
      <div className="login">
        <h1 style={{ textAlign: "center", position: "relative", top: "50px" }}>
          <u>Login</u>
        </h1>
        <p
          style={{
            textAlign: "center",
            position: "relative",
            top: "70px",
            fontWeight: "600",
          }}
        >
          Login to your account
        </p>
        <form className="inputs" onSubmit={handleSubmit}>
          <input
            type="email"
            name="emailID"
            placeholder="Email"
            onChange={handleChange}
            value={details.emailID}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            value={details.password}
          />
          <button className="buttons btnsgn" type="submit">
            Login <FontAwesomeIcon icon={faSignInAlt} />
          </button>
        </form>
        <p
          style={{
            textAlign: "center",
            position: "relative",
            bottom: "-150px",
          }}
        >
          Don't have an account ?{" "}
          <span>
            {" "}
            <p>
              <Link to="/">Signup</Link>
            </p>
          </span>
        </p>
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
