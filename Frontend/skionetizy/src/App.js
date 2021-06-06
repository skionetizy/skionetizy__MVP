import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Nav from "./Components/Nav";
import MarkDown from "./Components/markDown";
import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";
import Upload from "./Components/uploadImage";
import { FinalPage } from "./Components/finalPage";
import ExploreBlogs from "./Pages/ExploreBlogs";
import ViewBlog from "./Pages/ViewBlog";
import UserProfile from "./Components/UserProfile";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Nav exact path="/login" component={Login} />
          <Nav exact path="/" component={Signup} />
          <Nav exact path="/mark" component={MarkDown} />
          <Nav exact path="/upload" component={Upload} />
          <Nav exact path="/final" component={FinalPage} />
          <Nav exact path="/view-blog/:blogID/:userID" component={ViewBlog} />
        </Switch>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/" component={Signup} />
          <Route exact path="/mark" component={MarkDown} />
          <Route exact path="/upload" component={Upload} />
          <Route exact path="/final" component={FinalPage} />
          <Route exact path="/view-blog/:blogID/:userID" component={ViewBlog} />
          <Route exact path="/user-profile/" component={UserProfile} />
          <Route exact path="/explore-blogs" component={ExploreBlogs} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
