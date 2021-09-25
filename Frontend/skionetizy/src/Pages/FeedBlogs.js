import React, { useState, useEffect } from "react";
import { getFeedBlogs } from "../API/blogAPIHandler";
import useAsync from "../hooks/useAsync";
import { getLoggedInProfileID } from "../utils/AuthorisationUtils";
import axios from "axios";
import BlogCard from "../Components/BlogCard";
import FrameBorder from "../Components/FrameBorder";
import style from "./exploreBlogs.module.css";
import Spinner from "../Components/Spinner";

export default function FeedBlogs() {
  const [status, setStatus] = useState("idle");
  const [blogs, setBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasMoreBlogs, setHasMoreBlogs] = useState(true);

  const [page, setPage] = useState(0);
  const profileID = getLoggedInProfileID();

  useEffect(() => {
    const loadBlogs = () => {
      setLoading(true);
      setStatus("loading");
      getFeedBlogs({
        profileID,
        page,
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
  }, [currentBlog, hasMoreBlogs]);

  useEffect(() => {
    if (isVisible && status === "idle" && blogs.length > 0 && hasMoreBlogs) {
      setCurrentBlog((prev) => prev + 1);
    }
  }, [blogs.length, hasMoreBlogs, isVisible, status]);

  return (
    <>
      {blogs.length > 0 && (
        <FrameBorder title={<h1>My Feed</h1>}>
          <div
            className={`${style.blogCardContainer} ${style.container} ${style.body}`}
          >
            {blogs && blogs.map((blog) => <BlogCard blog={blog} />)}
          </div>
        </FrameBorder>
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
    </>
  );
}
