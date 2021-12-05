import React, { useEffect, useState } from "react";
import { getFeedBlogs } from "../API/blogAPIHandler";
import BlogCard from "../Components/BlogCard";
import FrameBorder from "../Components/FrameBorder";
import Spinner from "../Components/Spinner";
import ViewMore from "../Components/ViewMore";
import useAuth from "../hooks/useAuth";
import style from "./exploreBlogs.module.css";

export default function FeedBlogs() {
  const [status, setStatus] = useState("idle");
  const [blogs, setBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasMoreBlogs, setHasMoreBlogs] = useState(true);

  const auth = useAuth();
  const profileID = auth.profile?.profileID;

  useEffect(() => {
    const loadBlogs = () => {
      setLoading(true);
      setStatus("loading");
      getFeedBlogs({
        profileID,
        page: currentBlog,
      })
        .then((res) => {
          // console.log(Object.values(res.data.blogs);
          console.log(res.data);
          setBlogs((prevBlogs) => [...prevBlogs, ...res.data.blogs]);
        })
        .catch((err) => {
          if (err.response?.data.message === "exceeded bounds") {
            setHasMoreBlogs(false);
          }
        })
        .finally(() => {
          setStatus("idle");
          setLoading(false);
        });
    };
    if (hasMoreBlogs) {
      loadBlogs();
    }
  }, [currentBlog, hasMoreBlogs, profileID]);

  useEffect(() => {
    if (isVisible && status === "idle" && blogs.length > 0 && hasMoreBlogs) {
      setCurrentBlog((prev) => prev + 1);
    }
  }, [blogs.length, hasMoreBlogs, isVisible, status]);

  if (!profileID) {
    return <h3>Not logged in</h3>;
  }

  return (
    <>
      {blogs.length > 0 && (
        <>
        <FrameBorder
          title={
            <h1 style={{ paddingLeft: "4rem", color: "var(--primary-blue)" }}>
              My Feed
            </h1>
          }
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
  );
}
