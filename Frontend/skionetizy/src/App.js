import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import FullPageSpinner from "./Components/FullPageSpinner";
import Nav from "./Components/NavMenuBar";
import useAuth from "./hooks/useAuth";
import AdminRoutes from "./Pages/admin/routes";
import ViewBlog from "./Pages/ViewBlog";
import { getLoggedInProfileID } from "./utils/AuthorisationUtils";
import AdBlockerBlocker from "./Components/AdBlockerBlocker";
import { useDetectAdBlock } from "adblock-detect-react";
import PublicRoute from "./auth/PublicRoute";
import PrivateRoute from "./auth/PrivateRoute";
// import { Careers } from "./Pages/Careers";

// Lazy loading pages
const addBlogDetailsMarkdown = lazy(() =>
  import("./Pages/addBlogDetailsMarkdown")
);
const addBlogImage = lazy(() => import("./Pages/addBlogImage"));
const AddBlogKeywords = lazy(() => import("./Pages/addBlogKeywords"));
const DetailsPage = lazy(() => import("./Pages/detailsPage"));
const EmailVerification = lazy(() => import("./Pages/EmailVerification"));
const { FinalPage } = lazy(() => import("./Pages/finalPage"));
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword"));
const TermsAndConditions = lazy(() => import("./Pages/TermsAndConditions"));
const PrivacyPolicy = lazy(() => import("./Pages/PrivacyPolicy"));
const DmcaPage = lazy(() => import("./Pages/dmcaPage"));
const LandingPage = lazy(() => import("./Pages/Landing"));
const Login = lazy(() => import("./Pages/Login"));
const OAuthPage = lazy(() => import("./Pages/OAuthPage"));
const SearchPage = lazy(() => import("./Pages/searchPage"));
const Signup = lazy(() => import("./Pages/Signup"));
const UserNotFound = lazy(() => import("./Pages/UserNotFound"));
const UserProfile = lazy(() => import("./Pages/UserProfile"));
const ExploreBlogs = lazy(() => import("./Pages/ExploreBlogs"));
const Privacy = lazy(() => import("./Pages/Privacy"));
const ContactUs = lazy(() => import("./Pages/contactUsPage"));
const Careers = lazy(() => import("./Pages/Careers"));

function App() {
  const { saveProfile } = useAuth();
  useEffect(() => {
    const profileID = getLoggedInProfileID();
    if (profileID) saveProfile(profileID);
  }, []);

  const adBlockDetected = useDetectAdBlock(); // useDetectAdBlock() comes from a package named adblock-detect-react
  console.log(adBlockDetected);
  useEffect(() => {
    if (adBlockDetected) {
      console.log("ad block detected");
    }
  }, [adBlockDetected]);

  return (
    <Router>
      {!adBlockDetected ? (
        <>
          <Nav />
          <Suspense fallback={<FullPageSpinner />}>
            <Switch>
              <PublicRoute restricted={true} exact path="/signup" component={Signup} />
              <Route exact path="/landing" component={LandingPage} />
              <PublicRoute restricted={true} exact path="/login" component={Login} />
              <PublicRoute restricted={true} exact path="/forgotPassword" component={ForgotPassword} />
              <PublicRoute restricted={true} exact path="/forgotPassword/:token" component={ForgotPassword} />
              <Route path="/terms-and-conditions" component={TermsAndConditions} />
              <Route path="/privacy-policy" component={PrivacyPolicy} />
              <Route exact path="/dmca" component={DmcaPage} />
              <PrivateRoute
                exact
                path="/addBlogDetailsMarkdown"
                component={addBlogDetailsMarkdown}
              />
              <Route path="/contact" component={ContactUs} />
              <Route path="/careers" component={Careers} />
              <Route exact path="/userNotFound" component={UserNotFound} />
              <PrivateRoute exact path="/addBlogImage" component={addBlogImage} />
              <PrivateRoute exact path="/addBlogKeywords" component={AddBlogKeywords} />
              <Route exact path="/final" component={FinalPage} />
              <Route exact path="/details" component={DetailsPage} />
              {/* <Route exact path="/auth/authToken" component={OAuthPage} /> */}
              <PrivateRoute path="/admin" component={AdminRoutes} />
              <Route exact path="/privacy" component={Privacy} />
              <Route exact path="/" component={ExploreBlogs} />
              <Route exact path="/searchpage/:searchInput" component={SearchPage} />
              <Route
                exact
                // path='/view-blog/:blogID/:profileID'
                path="/:profileUserNameSlug/:blogTitleSlug/:blogID"
                component={ViewBlog}
              />
              <Route
                exact
                path="/emailVerification/:token"
                component={EmailVerification}
              />
              <Route path="/:profileUserName" component={UserProfile} />
            </Switch>
          </Suspense>
        </>
      ) : (
        <AdBlockerBlocker />
      )}
    </Router>
  );
}

export default App;
