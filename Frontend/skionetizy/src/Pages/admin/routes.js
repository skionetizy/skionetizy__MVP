import DashBoard from "./dashboard";
import { Switch, Route, Redirect } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import AdminSignup from "./AdminSignup";
import useAuth from "../../hooks/useAuth";
import AdminViewBlog from "../../Pages/admin/AdminViewBlog";

const prefix = "/admin";

function AdminRoutes() {
  const isAdmin = useAuth().profile?.role !== "admin";

  return (
    <Switch>
      {/* Navbar */}
      {isAdmin ? (
        <>
          <Route path={`${prefix}/dashboard`} component={DashBoard} />
          <Route
            path={`${prefix}/view-blog/:blogID/:profileID`}
            component={AdminViewBlog}
          />
          <Redirect from="/admin" to={prefix + "/dashboard"} exact />
        </>
      ) : (
        <UnauthorizedRoutes />
      )}
    </Switch>
  );
}

function UnauthorizedRoutes() {
  return (
    <>
      <Route path={prefix + "/login"} component={AdminLogin} />
      <Route path={prefix + "/signup"} component={AdminSignup} />
    </>
  );
}

export default AdminRoutes;
