import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Moment from "react-moment";

import axios from "axios";
// import moment from "moment";

import baseURL from "../utils/baseURL";
import {
  likeOnBlogAPIHandler,
  dislikeOnBlogAPIHandler,
  removeLikeOnBlogAPIHandler,
  removeDislikeOnBlogAPIHandler,
  getBlogAPIHandler,
} from "../API/blogAPIHandler";
import { getLoggedInUserID } from "../utils/AuthorisationUtils";

import style from "./ViewBlog.module.css";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ThumbDown from "@material-ui/icons/ThumbDown";
import MenuIcon from "@material-ui/icons/Menu";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ShareIcon from "@material-ui/icons/Share";

Moment.globalFormat = " MMM D, YYYY";

const ViewBlog = () => {
  const { blogID, userID } = useParams();
  const loggedInUser = getLoggedInUserID();
  const [blog, setBlog] = useState({});
  const [authorName, setAuthorName] = useState("");
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [dateString, setDateString] = useState("");

  const promise1 = axios.get(`${baseURL}/blog/getBlogByBlogID/${blogID}`);
  const promise2 = axios.get(`${baseURL}/user/getUserDetails/${userID}`);

  // console.log({ promise1, promise2 });

  useEffect(() => {
    axios.all([promise1, promise2]).then(
      axios.spread((...responses) => {
        const response1 = responses[0];
        setBlog(response1.data.blog);

        console.log({ blogInUseEffect: blog });
        // const formattedDate = formatTimestampToDate(blog.timestamp.date);
        const formattedDate = response1.data.blog.timestamp.$date;
        console.log({ formattedDateInUseEffect: formattedDate });
        setDateString(formattedDate);

        const response2 = responses[1];
        setAuthorName(response2.data.user.firstName);

        // console.log({
        //   response1Data: response1.data,
        //   response2Data: response2.data,
        // });
      })
    );
  }, [blog.likesCount, blog.dislikesCount]);
  //are the dependencies necessary?

  const handleLike = () => {
    console.log("clicked");
    //handling loggedInUser , also handle not logged in User
    if (hasLiked === false && hasDisliked === false) {
      likeOnBlogAPIHandler(blogID, loggedInUser).then((res) => {
        const blogResponse = res.blog;
        blogResponse &&
          setBlog((prevBlog) => ({
            ...prevBlog,
            likesCount: blogResponse.likesCount + 1,
          }));
        setHasLiked((previousHasLiked) => !previousHasLiked);
      });
    } else if (hasLiked === true && hasDisliked === false) {
      removeLikeOnBlogAPIHandler(blogID, loggedInUser).then((res) => {
        const blogResponse = res.blog;
        blogResponse &&
          setBlog((prevBlog) => ({
            ...prevBlog,
            likesCount: blogResponse.likesCount - 1,
          }));
        setHasLiked((previousHasLiked) => !previousHasLiked);
      });
    } else if (hasLiked === false && hasDisliked === true) {
      likeOnBlogAPIHandler(blogID, loggedInUser)
        .then((res) => {
          const blogResponse = res.blog;
          blogResponse &&
            setBlog((prevBlog) => ({
              ...prevBlog,
              likesCount: blogResponse.likesCount + 1,
            }));
          setHasLiked((previousHasLiked) => !previousHasLiked);
        })
        .catch((err) => console.log(err));

      removeDislikeOnBlogAPIHandler(blogID, loggedInUser)
        .then((res) => {
          const blogResponse = res.blog;
          blogResponse &&
            setBlog((prevBlog) => ({
              ...prevBlog,
              dislikesCount: blogResponse.dislikesCount - 1,
            }));
          setHasDisliked((previousHasDisliked) => !previousHasDisliked);
        })
        .catch((err) => console.log(err));
    }

    console.log({ hasLiked, hasDisliked });
  };

  const handleDislike = () => {
    console.log("disliked");
    //handling loggedInUser , also handle not logged in User

    if (hasDisliked === false && hasLiked === false) {
      dislikeOnBlogAPIHandler(blogID, loggedInUser)
        .then((res) => {
          const blogResponse = res.blog;
          blogResponse &&
            setBlog((prevBlog) => ({
              ...prevBlog,
              dislikesCount: blogResponse.dislikesCount + 1,
            }));
          setHasDisliked((previousHasDisliked) => !previousHasDisliked);
        })
        .catch((err) => console.log(err));
    } else if (hasDisliked === true && hasLiked === false) {
      removeDislikeOnBlogAPIHandler(blogID, loggedInUser)
        .then((res) => {
          const blogResponse = res.blog;
          blogResponse &&
            setBlog((prevBlog) => ({
              ...prevBlog,
              dislikesCount: blogResponse.dislikesCount - 1,
            }));
          console.log({ resInRemoveDisLike: blogResponse.dislikesCount });

          setHasDisliked((previousHasDisliked) => !previousHasDisliked);
        })
        .catch((err) => console.log(err));
    } else if (hasDisliked === false && hasLiked === true) {
      // if (removeLikeOnBlogAPIHandler(blogID, loggedInUser)) {
      //   setHasLiked((previousHasLiked) => !previousHasLiked);
      // }
      removeLikeOnBlogAPIHandler(blogID, loggedInUser)
        .then((res) => {
          const blogResponse = res.blog;
          blogResponse &&
            setBlog((prevBlog) => ({
              ...prevBlog,
              likesCount: blogResponse.likesCount - 1,
            }));
          setHasLiked((previousHasLiked) => !previousHasLiked);
        })
        .catch((err) => console.log(err));

      dislikeOnBlogAPIHandler(blogID, loggedInUser)
        .then((res) => {
          const blogResponse = res.blog;
          blogResponse &&
            setBlog((prevBlog) => ({
              ...prevBlog,
              dislikesCount: blogResponse.dislikesCount + 1,
            }));
          setHasDisliked((previousHasDisliked) => !previousHasDisliked);
        })
        .catch((err) => console.log(err));
    }
    console.log({ hasLiked, hasDisliked });
  };

  // const formatTimestampToDate = (inputTimestamp) => {
  //   var t = new Date(inputTimestamp);
  //   console.log({ inputTimestamp });
  //   // var formattedDate = t.format(" mm dd ,yyy ");

  //   console.log({ formattedDateInsideFunction: formattedDate });
  //   return formattedDate;
  // };

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
                {/* Published on <small>May 29, 2022</small> */}
                Published on{" "}
                <small>
                  <Moment>{dateString}</Moment>
                </small>
                {/* Published on <small>{blog.timestamp}</small>
                {console.log({ blogDate: blog.timestamp })} */}
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

            <ThumbUp
              fontSize="large"
              className={style.thumbUp}
              onClick={handleLike}
            />
          </div>
          <div className={style.dislikes}>
            <span>{blog.dislikesCount}</span>

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
              blogDetails: blog,
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBlog;
