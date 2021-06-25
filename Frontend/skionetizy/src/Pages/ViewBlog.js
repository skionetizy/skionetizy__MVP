import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import axios from "axios";
// import moment from "moment";

import baseURL from "../utils/baseURL";
import {
  likeOnBlogAPIHandler,
  dislikeOnBlogAPIHandler,
  removeLikeOnBlogAPIHandler,
  removeDislikeOnBlogAPIHandler,
} from "../API/blogAPIHandler";
import { getLoggedInUserID } from "../utils/AuthorisationUtils";

import style from "./ViewBlog.module.css";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ThumbDown from "@material-ui/icons/ThumbDown";
import MenuIcon from "@material-ui/icons/Menu";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ShareIcon from "@material-ui/icons/Share";

const ViewBlog = () => {
  const { blogID, userID } = useParams();
  const loggedInUser = getLoggedInUserID();
  const [blog, setBlog] = useState({});
  const [authorName, setAuthorName] = useState("");
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);

  const promise1 = axios.get(`${baseURL}/blog/getBlogByBlogID/${blogID}`);
  const promise2 = axios.get(`${baseURL}/user/getUserDetails/${userID}`);

  // console.log({ promise1, promise2 });

  useEffect(() => {
    axios.all([promise1, promise2]).then(
      axios.spread((...responses) => {
        const response1 = responses[0];
        setBlog(response1.data.blog);

        const response2 = responses[1];
        setAuthorName(response2.data.user.firstName);

        // console.log({
        //   response1Data: response1.data,
        //   response2Data: response2.data,
        // });
      })
    );
  }, [blog.likesCount, blog.dislikesCount]);

  const handleLike = () => {
    // const loggedInUser = getLoggedInUserID();
    console.log("clicked");
    //handling loggedInUser , also handle not logged in User
    if (hasLiked === false && hasDisliked === false) {
      const output = likeOnBlogAPIHandler(blogID, loggedInUser);
      console.log(output);
      // if (likeOnBlogAPIHandler(blogID, loggedInUser)) {
      //   setHasLiked((previousHasLiked) => !previousHasLiked);
      // }
    } else if (hasLiked === true && hasDisliked === false) {
      if (removeLikeOnBlogAPIHandler(blogID, loggedInUser)) {
        setHasLiked((previousHasLiked) => !previousHasLiked);
      }
    } else if (hasLiked === false && hasDisliked === true) {
      if (likeOnBlogAPIHandler(blogID, loggedInUser)) {
        setHasLiked((previousHasLiked) => !previousHasLiked);
      }

      if (removeDislikeOnBlogAPIHandler(blogID, loggedInUser)) {
        setHasDisliked((previousHasDisliked) => !previousHasDisliked);
      }
    }

    console.log({ hasLiked, hasDisliked });
  };

  const handleDislike = () => {
    console.log("disliked");
    //handling loggedInUser , also handle not logged in User

    if (hasDisliked === false && hasLiked === false) {
      if (dislikeOnBlogAPIHandler(blogID, loggedInUser)) {
        setHasDisliked((previousHasDisliked) => !previousHasDisliked);
      }
    } else if (hasDisliked === true && hasLiked === false) {
      if (removeDislikeOnBlogAPIHandler(blogID, loggedInUser)) {
        setHasDisliked((previousHasDisliked) => !previousHasDisliked);
      }
    } else if (hasDisliked === false && hasLiked === true) {
      if (likeOnBlogAPIHandler(blogID, loggedInUser)) {
        setHasLiked((previousHasLiked) => !previousHasLiked);
      }

      if (dislikeOnBlogAPIHandler(blogID, loggedInUser)) {
        setHasDisliked((previousHasDisliked) => !previousHasDisliked);
      }
    }
    console.log({ hasLiked, hasDisliked });
  };

  return (
    <div className={`${style.main} ${style.container}`}>
      <div className={style.blogHeader}>
        <h1 className={style.title}>{blog.blogTitle}</h1>
        <div className={style.author}>
          <div className={style.authorContents}>
            <img className={style.avatar} src="//unsplash.it/50/50" alt=" " />
            <div className={style.published}>
              <small className={style.authorName}>{authorName}</small>
              <small className={style.publishedDate}>
                Published on <small>May 29, 2022</small>
              </small>
            </div>
          </div>
          <div className={style.buttons}>
            <button className={`${style.button} ${style.followButton}`}>
              Follow
            </button>
            <button className={`${style.button} ${style.shareButton}`}>
              Share <ShareIcon fontSize="small" />
            </button>
          </div>
        </div>
      </div>
      <div className={style.blogArea}>
        <div className={style.blogCoverImage}>
          <img
            className={style.blogImage}
            src={`${blog.blogImageURL}`}
            alt=" "
          />
        </div>
        <div className={style.blogContent}>
          <article>{blog.blogDescription}</article>
        </div>
      </div>
      <div className={style.meta}>
        <div className={style.metaContent}>
          <div className={style.views}>
            <span>250</span>

            <VisibilityIcon fontSize="large" className={style.viewIcon} />
          </div>
          <div className={`${style.pushRight} ${style.likes}`}>
            <span>{blog.likesCount}</span>
            {/* use the above state of hasLiked and add the css or remove the css on the like button*/}
            <ThumbUp
              fontSize="large"
              className={style.thumbUp}
              onClick={handleLike}
            />
          </div>
          <div className={style.dislikes}>
            <span>{blog.dislikesCount}</span>
            {/* use the above state of hasDisliked and add the css or remove the css on the dislike button*/}
            <ThumbDown
              fontSize="large"
              className={style.thumbDown}
              onClick={handleDislike}
            />
            {console.log({
              intheAppLiked: hasLiked,
              intheAppDiskLiked: hasDisliked,
              inTheAppBlogLikesCount: blog.likesCount,
              intheAppBlogDislikes: blog.dislikesCount,
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBlog;
