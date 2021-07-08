import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Nav from "./Components/Nav";
import MarkDown from "./Components/markDown";
import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";
import Upload from "./Components/uploadImage";
import { FinalPage } from "./Pages/finalPage";
import ExploreBlogs from "./Pages/ExploreBlogs";
import ViewBlog from "./Pages/ViewBlog";
import UserProfile from "./Pages/UserProfile";
import DetailsPage from "./Pages/detailsPage";
import SearchPage from "./Pages/searchPage";

function App() {
  return (
    <Router>
      {/* <div> */}
      <Switch>
        <Nav exact path="/login" component={Login} />
        <Nav exact path="/" component={Signup} />
        <Nav exact path="/mark" component={MarkDown} />
        <Nav exact path="/upload" component={Upload} />
        <Nav exact path="/final" component={FinalPage} />
        <Nav exact path="/view-blog/:blogID/:userID" component={ViewBlog} />
        <Nav exact path="/details" component={DetailsPage} />
        <Nav exact path="/searchpage" component={SearchPage} />
      </Switch>
      <Switch>
        <Route exact path="/" component={Signup} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/markdown" component={MarkDown} />
        <Route exact path="/upload" component={Upload} />
        <Route exact path="/final" component={FinalPage} />
        <Nav exact path="/searchpage" component={SearchPage} />
        <Route exact path="/view-blog/:blogID/:userID" component={ViewBlog} />
        {/* <Route exact path="/user-profile/" component={UserProfile} /> */}

        <Route exact path="/explore-blogs" component={ExploreBlogs} />
        <Route exact path="/details" component={DetailsPage} />
        {/* <Route exact path="/:profileID" component={UserProfile} /> */}
        <Route exact path="/:profileUserName" component={UserProfile} />
      </Switch>
      {/* </div> */}
    </Router>
  );
}

export default App;
