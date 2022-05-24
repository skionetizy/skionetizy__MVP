import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  const isLoggedIn={...rest}.isLogin
  useEffect(() => {
    console.log("Public route rendered ", isLoggedIn);
  }, [isLoggedIn]);
  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn && restricted ? (
          {/* <Redirect to={`\\${props.profile.profileUserName}`}/> */},
          <Redirect
            to={{
              pathname: "/",
            }}
          />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

const mapStateToProps = (state) => {
  return {
    isLogin: state.isLogin,
    //profile: state.profile
  };
};

export default connect(mapStateToProps)(PublicRoute);
