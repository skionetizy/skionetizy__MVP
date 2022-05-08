/* import React, { Component } from "react";

import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "./AuthorisationUtils";

const PrivateRoute = ({ component: Component, ...rest }) => {
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location },
          }}
        />
      )
    }
  />;
};

export default PrivateRoute; */
// https://stackoverflow.com/questions/44510167/react-router-v4-redirect-passing-state-from-search-to-results#:~:text=isLoggedIn%20could%20be%20another%20state,another%20Route%20with%20preferred%20states.
