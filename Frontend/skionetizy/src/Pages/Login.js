import React from "react";
import { connect } from "react-redux";
import Vector from "../Assets/bro.svg";
import LoginForm from "../Components/LoginForm";
import style from "../Pages/login.module.css";

function Login(props) {
  return (
    <div className={`${style.container} ${style.cover_login}`}>
      <div className={style.coverImage_login}>
        <p>
          Over 500+ people have logged in Over 500+ people have logged in Over
          500+ people have logged in
        </p>
        <img src={Vector} alt="" className={style.coverImage_svgLogin} />
      </div>
      <div className={`${style.container} ${style.signin}`}>
        <h1 className={style.header}>Login</h1>
        <LoginForm />
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
