import React, { useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router";
import Vector from "../Assets/bro.svg";
import LoginForm from "../Components/LoginForm";
import VerifyEmailModal from "../Components/VerifyEmailModal";
import style from "../Pages/login.module.css";
import clsx from "../utils/clsx";

function Login(props) {
  const [showModal, setShowModal] = useState("");
  const history = useHistory();

  return (
    <>
      <div className={clsx(style.container, "center")}>
        <div className={`${style.cover_login}`}>
          <div className={style.coverImage_login}>
            <p>
              Over 500+ people have logged in Over 500+ people have logged in
              Over 500+ people have logged in
            </p>
            <img src={Vector} alt="" className={style.coverImage_svgLogin} />
          </div>

          <div className={`${style.signin}`}>
            <h1 className={style.header}>Login</h1>
            <LoginForm
              onLogin={(_user, error) => {
                if (error?.message === "Verfy Email Account") {
                  setShowModal("VERIFY_EMAIL");
                  return;
                }
                // after successful login goto `explore-blogs`
                history.push("/explore-blogs");
              }}
            />
          </div>
        </div>
      </div>
      {showModal === "VERFY_EMAIL" && (
        <VerifyEmailModal onClose={() => setShowModal("")} />
      )}
    </>
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
