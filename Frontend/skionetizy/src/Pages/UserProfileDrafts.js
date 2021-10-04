import React, { useEffect, useState } from "react";
import style from "./UserProfileDrafts.module.css";
import UserBlogsCard from "../Components/UserBlogsCard";
import axios from "axios";
import baseURL from "../utils/baseURL";
import Spinner from "../Components/Spinner";
import { Link, useParams } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import ViewMore from "../Components/ViewMore";
import clsx from "../utils/clsx";
import START_CREATING_BLOG_SRC from "../Assets/start_creating_blog.svg";
import { Center } from "../Components/Layouts";
import Button from "../Components/Button";
import { useDispatch } from "react-redux";

export default function UserProfileBlogs({ profile }) {
  const [status, setStatus] = useState("idle");
  const [drafts, setDrafts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMoreBlog, setHasMoreBlog] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const { profileUserName } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!profileUserName) return;

    setStatus("loading");
    axios
      .get(
        `${baseURL}/profile/getBlogsAndProfile/${page}/${profileUserName}/DRAFTS`
      )
      .then((res) => {
        setDrafts((prev) => [...prev, ...res.data.blogs]);
      })
      .catch((error) => {
        setHasMoreBlog(false);
        if (!error.isAxiosError) throw error;
      })
      .finally(() => {
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
      <div className={clsx(style.divider, drafts.length === 0 && style.hidden)}>
        <h2>My Drafts</h2>
      </div>

      {status === "loading" ? (
        <p className={style.loadingStatus}>
          <Spinner />
          &nbsp; Loading Drafts
        </p>
      ) : drafts.length === 0 ? (
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
          {drafts.map((blog, index) => (
            <div className={style.draftWrapper}>
              <UserBlogsCard key={index} blog={blog} profile={profile} />

              {/* <Link
              to="/addBlogDetailsMarkdown"
              onClick={() => {
                localStorage.setItem(
                  "CURRENT_EDITING_BLOG",
                  JSON.stringify(blog)
                  );
                }}
                className={style.editDraftBtn}
                >
                <FiEdit2 width="1em" />
              </Link> */}
            </div>
          ))}
        </div>
      )}

      <div
        className={clsx(
          style.bottomDivider,
          drafts.length === 0 && style.hidden
        )}
      ></div>

      {status === "loading" ? (
        <p className="center">
          <Spinner color="white" />
        </p>
      ) : hasMoreBlog === false ? (
        <p className={style.statusMessage}>End</p>
      ) : null}

      {drafts.length > 0 ? (
        <ViewMore onVisiblityChange={(isVisible) => setIsVisible(isVisible)} />
      ) : null}
    </>
  );
}
