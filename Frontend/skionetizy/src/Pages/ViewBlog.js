import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";

import baseURL from "../utils/baseURL";
import {
  likeOnBlogAPIHandler,
  dislikeOnBlogAPIHandler,
  removeLikeOnBlogAPIHandler,
  removeDislikeOnBlogAPIHandler,
} from "../API/blogAPIHandler";

import { getLoggedInUserID } from "../utils/AuthorisationUtils";
import { saveBlogIDUtil } from "../utils/blogUtil";

import style from "./ViewBlog.module.css";
import styles from "../Components/comments.module.css";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ThumbUpOutlined from "@material-ui/icons/ThumbUpOutlined";
import ThumbDown from "@material-ui/icons/ThumbDown";
import ThumbDownOutlined from "@material-ui/icons/ThumbDownOutlined";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ShareIcon from "@material-ui/icons/Share";

import Comments from "../Components/comments";
import Moment from "react-moment";

Moment.globalFormat = "MMM D , YYYY";

const ViewBlog = () => {
  const { blogID, userID } = useParams();
  const loggedInUser = getLoggedInUserID();
  const [blog, setBlog] = useState({});
  const [authorName, setAuthorName] = useState("");
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [commentStatusMessage, setCommentStatusMessage] = useState("");

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

        // localStorage.setItem("blogID",response1.data.blog.blogID)
        // response1.data.blog.blogID
        saveBlogIDUtil(response1.data.blog.blogID);
      })
    );
  }, []);
  // useEffect(() => {}, [blog?.comments?.length]);
  const updateCommentStatusMessageParent = (message) => {
    setCommentStatusMessage(message);
  };
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
        setHasLikedIcon(<ThumbUp fontSize="large" />);
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
        setHasLikedIcon(<ThumbUpOutlined fontSize="large" />);
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

          setHasDisliked((previousHasDisliked) => !previousHasDisliked);
          setHasDislikedIcon(<ThumbDownOutlined fontSize="large" />);
        })
        .catch((err) => console.log(err));
    }

    console.log({ hasLiked, hasDisliked });
  };

  const handleDislike = () => {
    console.log("disliked");

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
          setHasDislikedIcon(<ThumbDown fontSize="large" />);
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
          setHasDislikedIcon(<ThumbDownOutlined fontSize="large" />);
        })
        .catch((err) => console.log(err));
    } else if (hasDisliked === false && hasLiked === true) {
      removeLikeOnBlogAPIHandler(blogID, loggedInUser)
        .then((res) => {
          const blogResponse = res.blog;
          blogResponse &&
            setBlog((prevBlog) => ({
              ...prevBlog,
              likesCount: blogResponse.likesCount - 1,
            }));

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

          setHasDisliked((previousHasDisliked) => !previousHasDisliked);
          setHasDislikedIcon(<ThumbDown fontSize="large" />);
        })
        .catch((err) => console.log(err));
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
          </div>
        </div>
      </div>
      <div className={styles.comments}>
        <div className={styles.comment_count}>
          <h3>
            {/* <span>45</span> Comments */}
            <span>{blog?.comments?.length}</span> Comments
            {/* {console.log({ blogIDInComments: blogID })} */}
            {console.log({ commentStatusMessage })}
            {/* {commentStatusMessage} */}
          </h3>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();

            axios
              .patch(`http://127.0.0.1:5000/blog/addCommentToBlog`, {
                commentStatusMessage,
              })
              .then((response) => {
                console.log(JSON.stringify(response));
              })
              .catch((error) => {
                console.log("It is not working");
              });
            setCommentStatusMessage(e.target.elements.input.value);
          }}
          className={style.commentForm}
        >
          <input
            className={style.commentInput}
            name="input"
            type="text"
            placeholder="Add to the dicussion..."
          ></input>

          <div>
            <button className={style.button} type="submit">
              Submit
            </button>
          </div>
        </form>

        {commentStatusMessage && (
          <p className={style.commentStatus}>Status : {commentStatusMessage}</p>
        )}

        <div className={styles.comments_container}>
          {blog?.comments?.map((comment, commentIndex) => (
            <Comments
              comment={comment}
              key={commentIndex}
              updateCommentStatusMessage={(commentStatusMessage) =>
                updateCommentStatusMessageParent(commentStatusMessage)
              }
            />
          ))}
          <Comments />
        </div>
      </div>
    </div>
  );
};

export default ViewBlog;
