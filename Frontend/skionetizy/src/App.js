import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Nav from "./Components/Nav";
import addBlogDetailsMarkdown from "./Pages/addBlogDetailsMarkdown";
import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";
import addBlogImage from "./Pages/addBlogImage";
import { FinalPage } from "./Pages/finalPage";
import ExploreBlogs from "./Pages/ExploreBlogs";
import ViewBlog from "./Pages/ViewBlog";
import UserProfile from "./Pages/UserProfile";
import DetailsPage from "./Pages/detailsPage";
import SearchPage from "./Pages/searchPage";
import EmailVerification from "./Pages/EmailVerification";
import Editor from "./Components/Editor";
import OAuthPage from "./Pages/OAuthPage";
import AddBlogKeywords from "./Pages/addBlogKeywords";
import ForgotPassword from "./Pages/ForgotPassword";

function App() {
  return (
    <Router>
      <Nav />
      <Switch>
        <Route exact path="/" component={Signup}></Route>
        <Route exact path="/editor_example" component={Editor} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/forgotPassword" component={ForgotPassword} />
        <Route
          exact
          path="/addBlogDetailsMarkdown"
          component={addBlogDetailsMarkdown}
        />
        <Route exact path="/addBlogImage" component={addBlogImage} />
        <Route exact path="/addBlogKeywords" component={AddBlogKeywords} />
        <Route exact path="/final" component={FinalPage} />
        <Route exact path="/searchpage" component={SearchPage} />
        <Route
          exact
          path="/view-blog/:blogID/:profileID"
          component={ViewBlog}
        />

        <Route exact path="/explore-blogs" component={ExploreBlogs} />

        <Route exact path="/details" component={DetailsPage} />

        <Route
          exact
          path="/emailVerification/:token"
          component={EmailVerification}
        />
        <Route exact path="/auth/authToken" component={OAuthPage} />
        <Route path="/:profileUserName" component={UserProfile} />
      </Switch>
    </Router>
  );
}

export default App;
