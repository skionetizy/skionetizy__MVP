import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import BlogCard from "../Components/BlogCard";
import Spinner from "../Components/Spinner";
import ViewMore from "../Components/ViewMore";
import style from "../Pages/exploreBlogs.module.css";
import baseURL from "../utils/baseURL";
import ExploreHeroBannerSrc from "../Assets/explore_hero_banner.png";
import Footer from "../Components/Footer";
import FrameBorder from "../Components/FrameBorder";
import clsx from "../utils/clsx";
import FeedBlogs from "./FeedBlogs";
import useAuth from "../hooks/useAuth";

const url = `${baseURL}/blog/getBlogsPaginated`;

function MyBlogs(props) {
  const [status, setStatus] = useState("idle");
  const [blogs, setBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasMoreBlogs, setHasMoreBlogs] = useState(true);
  const auth = useAuth();

  const [view, setView] = useState("trending");

  useEffect(() => {
    const loadBlogs = () => {
      setLoading(true);
      setStatus("loading");
      axios
        .get(url + `/${currentBlog}`)
        .then((res) => {

          setBlogs((prevBlogs) => [...prevBlogs, ...res.data.blogs]);

          console.log("res", { res });

        })
        .catch((err) => {

          if (err.response?.data.message === "exceeded bounds") {
            setHasMoreBlogs(false);
          }
          console.log("in errror 46 exploreblogs", err);
        })
        .finally(() => {
          setStatus("idle");
          setLoading(false);
        });
    };
    if (hasMoreBlogs) {
      loadBlogs();
    }
  }, [currentBlog, hasMoreBlogs]);

  useEffect(() => {
    if (isVisible && status === "idle" && blogs.length > 0 && hasMoreBlogs) {
      setCurrentBlog((prev) => prev + 1);
    }
    console.log({ currentBlog });
  }, [blogs.length, hasMoreBlogs, isVisible, status]);

  return (
    <>
      <div className={style.main}>
        <img
          className={style.heroBanner}
          src={ExploreHeroBannerSrc}
          width="100%"
          alt="notebook's pages flipping by wind"
        />

        <div className={style.exploreBtnGroup}>
          <ExploreButton
            isActive={view === "trending"}
            onClick={() => setView("trending")}
          >
            Trending
          </ExploreButton>

          {auth.isLoggedIn && (
            <ExploreButton
              isActive={view === "my_feed"}
              onClick={() => setView("my_feed")}
            >
              My Feed
            </ExploreButton>
          )}
        </div>

        {view === "trending" ? (
          <>
            {blogs.length > 0 && (
              <>
                <FrameBorder
                  className={blogs.length === 0 && "hidden"}
                  title={<h1 className={style.headerTitle}>Trending</h1>}
                >
                  <div
                    className={`${style.blogCardContainer} ${style.container} ${style.body}`}
                  >
                    {blogs && blogs.map((blog) => <BlogCard blog={blog} />)}
                  </div>
                </FrameBorder>
                {/* Show after initial fetching 9-12 blogs */}
                <ViewMore
                  className={style.viewMore}
                  onVisiblityChange={(isVisible) => setIsVisible(isVisible)}
                />
              </>
            )}
            {/* Loading Spinner */}
            {status === "loading" && (
              <>
                <div className={style.spinnerWrapper}>
                  <Spinner color="white" />
                  <span className={style.statusMessage}>
                    Loading <span className="ani-typing">...</span>
                  </span>
                </div>
              </>
            )}
            {/* Status Message */}
            {hasMoreBlogs === false && (
              <p className={style.statusMessage}>🎉You have reached to end</p>
            )}
          </>
        ) : view === "my_feed" ? (
          <FeedBlogs />
        ) : null}
      </div>
      <Footer />
    </>
  );
}

function ExploreButton({ isActive, children, ...props }) {
  return (
    <button
      className={clsx(style.exploreBtn, isActive && style.exploreBtnActive)}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveSlicedBlogs: (blogs) =>
      dispatch({ type: "SAVE_SLICED_BLOGS", payload: blogs }),
  };
};
export default connect(null, mapDispatchToProps)(MyBlogs);
