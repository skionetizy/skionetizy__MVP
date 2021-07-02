import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import axios from "axios";

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
import ThumbUpOutlined from "@material-ui/icons/ThumbUpOutlined";
import ThumbDown from "@material-ui/icons/ThumbDown";
import ThumbDownOutlined from "@material-ui/icons/ThumbDownOutlined";
import MenuIcon from "@material-ui/icons/Menu";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ShareIcon from "@material-ui/icons/Share";
import Moment from "react-moment";

Moment.globalFormat = "MMM D , YYYY";

const ViewBlog = () => {
  const { blogID, userID } = useParams();
  const loggedInUser = getLoggedInUserID();
  const [blog, setBlog] = useState({});
  const [authorName, setAuthorName] = useState("");
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);

  const [hasLikedIcon, setHasLikedIcon] = useState(
    <ThumbUpOutlined fontSize="large" />
  );
  const [hasDislikedIcon, setHasDislikedIcon] = useState(
    <ThumbDownOutlined fontSize="large" />
  );

  const promise1 = axios.get(`${baseURL}/blog/getBlogByBlogID/${blogID}`);
  const promise2 = axios.get(`${baseURL}/user/getUserDetails/${userID}`);

  // console.log({ promise1, promise2 });

  const findUserHasLiked = (likedUsersArray, userID) => {
    const result = !!likedUsersArray.find(
      (userInArray) => userInArray === userID
    );
    console.log({ resultInfindUserHasLiked: result });
    return !!likedUsersArray.find((userInArray) => userInArray === userID);
  };
  const findUserHasDisliked = (DislikedUsersArray, userID) => {
    const result = !!DislikedUsersArray.find(
      (userInArray) => userInArray === userID
    );
    console.log({ resultInfindUserHasDisLiked: result });
    return !!DislikedUsersArray.find((userInArray) => userInArray === userID);
  };

  useEffect(() => {
    axios.all([promise1, promise2]).then(
      axios.spread((...responses) => {
        const response1 = responses[0];
        console.log({ blogInUseEffect: response1.data.blog });
        setBlog(response1.data.blog);

        // setHasLiked(response1.data.blog.hasLiked);
        // setHasDisliked(response1.data.blog.hasDisliked);
        const resultHasLiked = findUserHasLiked(
          response1.data.blog.likedByUsersList,
          userID
        );
        const resultHasDisliked = findUserHasDisliked(
          response1.data.blog.dislikedByUsersList,
          userID
        );
        setHasLiked(resultHasLiked);
        setHasDisliked(resultHasDisliked);

        resultHasLiked
          ? setHasLikedIcon(<ThumbUp fontSize="large" />)
          : setHasLikedIcon(<ThumbUpOutlined fontSize="large" />);
        resultHasDisliked
          ? setHasDislikedIcon(<ThumbDown fontSize="large" />)
          : setHasDislikedIcon(<ThumbDownOutlined fontSize="large" />);

        const response2 = responses[1];
        setAuthorName(response2.data.user.firstName);

        // console.log({
        //   response1Data: response1.data,
        //   response2Data: response2.data,
        // });
      })
    );
  }, []);

  const handleLike = () => {
    console.log("clicked");
    //handling loggedInUser , also handle not logged in User
    if (hasLiked === false && hasDisliked === false) {
      // if (blog.hasLiked === false && blog.hasDisliked === false) {
      likeOnBlogAPIHandler(blogID, loggedInUser).then((res) => {
        const blogResponse = res.blog;
        blogResponse &&
          setBlog((prevBlog) => ({
            ...prevBlog,
            likesCount: blogResponse.likesCount + 1,
          }));
        //   setBlog((prevBlog) => ({
        //     ...prevBlog,
        //     likesCount: blogResponse.likesCount + 1,
        //     hasLiked: !prevBlog.hasLiked,
        //   }));
        setHasLiked((previousHasLiked) => !previousHasLiked);
        setHasLikedIcon(<ThumbUp fontSize="large" />);
      });
    } else if (hasLiked === true && hasDisliked === false) {
      // } else if (blog.hasLiked === true && blog.hasDisliked === false) {
      removeLikeOnBlogAPIHandler(blogID, loggedInUser).then((res) => {
        const blogResponse = res.blog;
        blogResponse &&
          setBlog((prevBlog) => ({
            ...prevBlog,
            likesCount: blogResponse.likesCount - 1,
          }));
        //   setBlog((prevBlog) => ({
        //     ...prevBlog,
        //     likesCount: blogResponse.likesCount - 1,
        //     hasLiked: !prevBlog.hasLiked,
        //   }));
        setHasLiked((previousHasLiked) => !previousHasLiked);
        setHasLikedIcon(<ThumbUpOutlined fontSize="large" />);
      });
    } else if (hasLiked === false && hasDisliked === true) {
      // } else if (blog.hasLiked === false && blog.hasDisliked === true) {
      likeOnBlogAPIHandler(blogID, loggedInUser)
        .then((res) => {
          const blogResponse = res.blog;
          blogResponse &&
            setBlog((prevBlog) => ({
              ...prevBlog,
              likesCount: blogResponse.likesCount + 1,
            }));
          // setBlog((prevBlog) => ({
          //   ...prevBlog,
          //   likesCount: blogResponse.likesCount + 1,
          //   hasLiked: !prevBlog.hasLiked,
          // }));
          setHasLiked((previousHasLiked) => !previousHasLiked);
          setHasLikedIcon(<ThumbUp fontSize="large" />);
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
          // setBlog((prevBlog) => ({
          //   ...prevBlog,
          //   dislikesCount: blogResponse.dislikesCount - 1,
          //   hasDisliked: !prevBlog.hasDisliked,
          // }));
          setHasDisliked((previousHasDisliked) => !previousHasDisliked);
          setHasDislikedIcon(<ThumbDownOutlined fontSize="large" />);
        })
        .catch((err) => console.log(err));
    }

    console.log({ hasLiked, hasDisliked });
    // console.log({ hasLiked: blog.hasLiked, hasDisliked: blog.hasDisliked });
  };

  const handleDislike = () => {
    console.log("disliked");
    //handling loggedInUser , also handle not logged in User

    if (hasDisliked === false && hasLiked === false) {
      // if (blog.hasDisliked === false && blog.hasLiked === false) {
      dislikeOnBlogAPIHandler(blogID, loggedInUser)
        .then((res) => {
          const blogResponse = res.blog;
          blogResponse &&
            setBlog((prevBlog) => ({
              ...prevBlog,
              dislikesCount: blogResponse.dislikesCount + 1,
            }));
          // setBlog((prevBlog) => ({
          //   ...prevBlog,
          //   dislikesCount: blogResponse.dislikesCount + 1,
          //   hasDisliked: !prevBlog.hasDisliked,
          // }));
          setHasDisliked((previousHasDisliked) => !previousHasDisliked);
          setHasDislikedIcon(<ThumbDown fontSize="large" />);
        })
        .catch((err) => console.log(err));
    } else if (hasDisliked === true && hasLiked === false) {
      // } else if (blog.hasDisliked === true && blog.hasLiked === false) {
      removeDislikeOnBlogAPIHandler(blogID, loggedInUser)
        .then((res) => {
          const blogResponse = res.blog;
          blogResponse &&
            setBlog((prevBlog) => ({
              ...prevBlog,
              dislikesCount: blogResponse.dislikesCount - 1,
            }));
          // setBlog((prevBlog) => ({
          //   ...prevBlog,
          //   dislikesCount: blogResponse.dislikesCount - 1,
          //   hasDisliked: !prevBlog.hasDisliked,
          // }));
          console.log({ resInRemoveDisLike: blogResponse.dislikesCount });

          setHasDisliked((previousHasDisliked) => !previousHasDisliked);
          setHasDislikedIcon(<ThumbDownOutlined fontSize="large" />);
        })
        .catch((err) => console.log(err));
    } else if (hasDisliked === false && hasLiked === true) {
      // } else if (blog.hasDisliked === false && blog.hasLiked === true) {
      removeLikeOnBlogAPIHandler(blogID, loggedInUser)
        .then((res) => {
          const blogResponse = res.blog;
          blogResponse &&
            setBlog((prevBlog) => ({
              ...prevBlog,
              likesCount: blogResponse.likesCount - 1,
            }));
          // setBlog((prevBlog) => ({
          //   ...prevBlog,
          //   likesCount: blogResponse.likesCount - 1,
          //   hasLiked: !prevBlog.hasLiked,
          // }));
          setHasLiked((previousHasLiked) => !previousHasLiked);
          setHasLikedIcon(<ThumbUpOutlined fontSize="large" />);
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
          // setBlog((prevBlog) => ({
          //   ...prevBlog,
          //   dislikesCount: blogResponse.dislikesCount + 1,
          //   hasDisliked: !prevBlog.hasDisliked,
          // }));
          setHasDisliked((previousHasDisliked) => !previousHasDisliked);
          setHasDislikedIcon(<ThumbDown fontSize="large" />);
        })
        .catch((err) => console.log(err));
    }
    // console.log({ hasLiked: blog.hasLiked, hasDisliked: blog.hasDisliked });
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
                {/* Published on <small>May 29, 2022</small> */}
                Published on
                <small>
                  <Moment>{blog?.timestamp?.$date}</Moment>
                </small>
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
            <span className={style.viewCount}>250</span>

            <VisibilityIcon fontSize="large" className={style.viewIcon} />
          </div>
          <div className={`${style.pushRight} ${style.likes}`}>
            <span className={style.likesCount}>{blog.likesCount}</span>
            <div className={style.thumbUp} onClick={handleLike}>
              {hasLikedIcon}
            </div>
          </div>
          <div className={style.dislikes}>
            <span className={style.dislikesCount}>{blog.dislikesCount}</span>
            <div className={style.thumbDown} onClick={handleDislike}>
              {hasDislikedIcon}
            </div>
            {console.log({
              intheAppLiked: hasLiked,
              intheAppDiskLiked: hasDisliked,
              blogInApp: blog,
              inTheAppBlogLikesCount: blog.likesCount,
              intheAppBlogDislikes: blog.dislikesCount,
            })}
            {/* {console.log({
              intheAppLiked: blog.hasLiked,
              intheAppDiskLiked: blog.hasDisliked,
              inTheAppBlogLikesCount: blog.likesCount,
              intheAppBlogDislikes: blog.dislikesCount,
            })} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBlog;
