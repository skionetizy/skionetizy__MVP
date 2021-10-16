import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import FullPageSpinner from "./Components/FullPageSpinner";
import Nav from "./Components/NavMenuBar";
import useAuth from "./hooks/useAuth";
import AdminRoutes from "./Pages/admin/routes";
import ViewBlog from "./Pages/ViewBlog";

// Lazy loading pages
const addBlogDetailsMarkdown = lazy(() =>
  import("./Pages/addBlogDetailsMarkdown")
);
const addBlogImage = lazy(() => import("./Pages/addBlogImage"));
const AddBlogKeywords = lazy(() => import("./Pages/addBlogKeywords"));
const DetailsPage = lazy(() => import("./Pages/detailsPage"));
const EmailVerification = lazy(() => import("./Pages/EmailVerification"));
const {FinalPage} = lazy(() => import("./Pages/finalPage"));
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword"));
const LandingPage = lazy(() => import("./Pages/Landing"));
const Login = lazy(() => import("./Pages/Login"));
const OAuthPage = lazy(() => import("./Pages/OAuthPage"));
const SearchPage = lazy(() => import("./Pages/searchPage"));
const Signup = lazy(() => import("./Pages/Signup"));
const UserNotFound = lazy(() => import("./Pages/UserNotFound"));
const UserProfile = lazy(() => import("./Pages/UserProfile"));
const ExploreBlogs = lazy(() => import("./Pages/ExploreBlogs"));

function App() {
    return (
        <Router>
            <Nav/>
            <Suspense fallback={<FullPageSpinner/>}>
                <Switch>
                    <Route exact path="/signup" component={Signup}/>
                    <Route exact path="/landing" component={LandingPage}/>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/forgotPassword" component={ForgotPassword}/>
                    <Route exact path="/addBlogDetailsMarkdown" component={addBlogDetailsMarkdown}/>
                    <Route exact path="/userNotFound" component={UserNotFound}/>
                    <Route exact path="/addBlogImage" component={addBlogImage}/>
                    <Route exact path="/addBlogKeywords" component={AddBlogKeywords}/>
                    <Route exact path="/final" component={FinalPage}/>
                    <Route exact path="/searchpage/:searchInput" component={SearchPage}/>
                    <Route exact path="/view-blog/:blogID/:profileID" component={ViewBlog}/>
                    <Route exact path="/details" component={DetailsPage}/>
                    <Route exact path="/emailVerification/:token" component={EmailVerification}/>
                    <Route exact path="/auth/authToken" component={OAuthPage}/>
                    <Route path="/admin" component={AdminRoutes}/>
                    <Route path="/:profileUserName" component={UserProfile}/>
                    <Route exact path="/" component={ExploreBlogs}/>
                </Switch>
            </Suspense>
        </Router>
    );
}

export default App;
