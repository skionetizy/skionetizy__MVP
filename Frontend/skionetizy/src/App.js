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
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/landing" component={LandingPage} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/forgotPassword" component={ForgotPassword} />
          <Route exact path="/forgotPassword/:token" component={ForgotPassword} />
          <Route path="/terms-and-conditions" component={TermsAndConditions} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route exact path="/dmca" component={DmcaPage} />
          <Route
            exact
            path="/addBlogDetailsMarkdown"
            component={addBlogDetailsMarkdown}
          />
          <Route exact path="/userNotFound" component={UserNotFound} />
          <Route exact path="/addBlogImage" component={addBlogImage} />
          <Route exact path="/addBlogKeywords" component={AddBlogKeywords} />
          <Route exact path="/final" component={FinalPage} />
          <Route exact path="/details" component={DetailsPage} />
          <Route exact path="/auth/authToken" component={OAuthPage} />
          <Route path="/admin" component={AdminRoutes} />
          <Route exact path="/privacy" component={Privacy} />
          <Route exact path="/" component={ExploreBlogs} />
          <Route exact path="/searchpage/:searchInput" component={SearchPage} />
          <Route
            exact
            // path='/view-blog/:blogID/:profileID'
            path="/:profileNameSlug/:blogTitleSlug/:blogID"
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
        <AdBlockerBlocker/>
      )}
    </Router>
  );
}

export default App;
