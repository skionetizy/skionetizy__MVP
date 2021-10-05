import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../Components/Spinner";
import UserBlogsCard from "../Components/UserBlogsCard";
import ViewMore from "../Components/ViewMore";
import baseURL from "../utils/baseURL";
import clsx from "../utils/clsx";
import style from "./UserProfileDrafts.module.css";
import START_CREATING_BLOG_SRC from "../Assets/start_creating_blog.svg";
import { Center } from "../Components/Layouts";
import Button from "../Components/Button";
import { useDispatch } from "react-redux";

export default function UserProfileDrafts({ profile }) {
  const [status, setStatus] = useState("idle");
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMoreBlog, setHasMoreBlog] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const { profileUserName } = useParams();
  const dispatch = useDispatch();
  console.log("hellow");

  useEffect(() => {
    if (!profileUserName) return;

    setStatus("loading");
    Promise.all([
      axios
        .get(
          `${baseURL}/profile/getBlogsAndProfile/${page}/${profileUserName}/PUBLISHED`
        )
        .catch(() => null),
      axios
        .get(
          `${baseURL}/profile/getBlogsAndProfile/${page}/${profileUserName}/NON_DRAFTS`
        )
        .catch(() => null),
    ]).then(([resPublished, resNonDrafts]) => {
      let mergeBlogs = [];
      console.log("$$$$$$$$$$$$$$$##############", resPublished, resNonDrafts);
      if (resPublished != null)
        mergeBlogs = [...mergeBlogs, ...resPublished.data.blogs];

      if (resNonDrafts != null)
        mergeBlogs = [...mergeBlogs, ...resNonDrafts.data.blogs];

      if (mergeBlogs.length > 0) setBlogs((prev) => [...prev, ...mergeBlogs]);
      else setHasMoreBlog(false);

      setStatus("idle");
    });
  }, [profileUserName, page]);

  useEffect(() => {
    if (isVisible && status === "idle" && hasMoreBlog) {
      setPage((page) => page + 1);
    }
  }, [hasMoreBlog, isVisible, status]);

  return (
    <>
      <div className={clsx(style.divider, blogs.length === 0 && style.hidden)}>
        <h2>My Blogs</h2>
      </div>

      {status === "loading" && blogs.length === 0 ? (
        <p className={style.loadingStatus}>
          <Spinner />
          &nbsp; Loading Blogs
        </p>
      ) : blogs.length === 0 ? (
        <div className={style.noBlogWrapper}>
          <p className="center">No Blogs Yet..</p>

          <img
            src={START_CREATING_BLOG_SRC}
            className={style.noBlogIllustration}
            alt="user taking a holographical post summary card by hand and pasting on blog feed holographic wall"
          />

          <p className="center">Start creating. click on the button</p>

          <Center>
            <Button
              link
              to="/addBlogDetailsMarkdown"
              onClick={() => {
                dispatch({ type: "MARKDOWN_MODE", payload: "add" });
              }}
            >
              Add Blog
            </Button>
          </Center>
        </div>
      ) : (
        <div className={style.userBlogs}>
          {blogs.map((blog, index) => (
            <UserBlogsCard key={index} blog={blog} profile={profile} />
          ))}
        </div>
      )}

      <div
        className={clsx(
          style.bottomDivider,
          blogs.length === 0 && style.hidden
        )}
      ></div>

      {status === "loading" ? (
        <p className="center">
          <Spinner color="white" />
        </p>
      ) : hasMoreBlog === false ? (
        <p className={style.statusMessage}>End</p>
      ) : null}

      {blogs.length > 0 ? (
        <ViewMore onVisiblityChange={(isVisible) => setIsVisible(isVisible)} />
      ) : null}
    </>
  );
}
