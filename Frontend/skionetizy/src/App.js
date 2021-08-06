import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Nav from "./Components/Nav";
import MarkDown from "./Pages/addBlogDetailsMarkdown";
import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";
import Upload from "./Pages/addBlogImage";
import { FinalPage } from "./Pages/finalPage";
import ExploreBlogs from "./Pages/ExploreBlogs";
import ViewBlog from "./Pages/ViewBlog";
import UserProfile from "./Pages/UserProfile";
import DetailsPage from "./Pages/detailsPage";
import SearchPage from "./Pages/searchPage";
import EmailVerification from "./Pages/EmailVerification";
import EditProfile from "./Pages/EditProfile";

function App() {
  return (
    <Router>
      <Nav />
      <Switch>
        <Route exact path="/" component={Signup} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/addBlogDetailsMarkdown" component={MarkDown} />
        <Route exact path="/addBlogImage" component={Upload} />
        <Route exact path="/final" component={FinalPage} />
        <Route exact path="/searchpage" component={SearchPage} />
        <Route exact path="/view-blog/:blogID/:userID" component={ViewBlog} />
        {/* <Route exact path="/user-profile/" component={UserProfile} /> */}

        <Route exact path="/explore-blogs" component={ExploreBlogs} />

        <Route exact path="/details" component={DetailsPage} />
        {/* <Route exact path="/:profileID" component={UserProfile} /> */}
        {/* <Route exact path="/edit-profile/:profileID" component={EditUserProfile}/> */}
        <Route
          exact
          path="/emailVerification/:token"
          component={EmailVerification}
        />
        <Route
          exact
          path="/edit-profile/:profileUserName"
          component={EditProfile}
        />
        <Route exact path="/:profileUserName" component={UserProfile} />
      </Switch>
      {/* </div> */}
    </Router>
  );
}

export default App;
