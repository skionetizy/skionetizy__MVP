import DashBoard from "./dashboard";
import { Switch, Route, Redirect } from "react-router-dom";

const prefix = "/admin";

function AdminRoutes() {
  return (
    <Switch>
      <Route path={`${prefix}/dashboard`} component={DashBoard} />
      <Redirect from="/admin" to={prefix + "/dashboard"} exac />
    </Switch>
  );
}

export default AdminRoutes;
