import React, { Component } from "react";

import { Route, Redirect } from "react-router-dom";
import { isAuthenticated, userRole } from "./AuthorisationUtils";

const AdminRoute = ({ component: Component, ...rest }) => {
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() && userRole() == 1 ? (
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

export default AdminRoute;
