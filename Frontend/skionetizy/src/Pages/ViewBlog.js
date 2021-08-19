import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";

import baseURL from "../utils/baseURL";
import {
  likeOnBlogAPIHandler,
  dislikeOnBlogAPIHandler,
  removeLikeOnBlogAPIHandler,
  removeDislikeOnBlogAPIHandler,
  addCommentAPIHandler,
  addViewApiHandler,
} from "../API/blogAPIHandler";

import { getLoggedInProfileID } from "../utils/AuthorisationUtils";

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
  const { blogID, profileID } = useParams();

  const loggedInUserProfile = getLoggedInProfileID();
  const [blog, setBlog] = useState({});
  const [showComment, setShowComment] = useState(false);
  const [length, setLength] = useState(3);
  const [viewMore, setViewMore] = useState("View more");

  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [commentStatusMessage, setCommentStatusMessage] = useState("");
  const [viewCountData, setViewCountData] = useState({
    timeout: false,
    scroll: false,
    hasSent: false,
  });
  const [comments, setComments] = useState();
  const scrollTargetRef = useRef();

  const [hasLikedIcon, setHasLikedIcon] = useState(
    <ThumbUpOutlined fontSize="large" />
  );
  const [hasDislikedIcon, setHasDislikedIcon] = useState(
    <ThumbDownOutlined fontSize="large" />
  );

  const findUserHasLiked = (likedUsersArray, profileID) => {
    const result = !!likedUsersArray.find(
      (userInArray) => userInArray === profileID
    );
    console.log({ resultInfindUserHasLiked: result });
    return !!likedUsersArray.find((userInArray) => userInArray === profileID);
  };
  const findUserHasDisliked = (DislikedUsersArray, profileID) => {
    const result = !!DislikedUsersArray.find(
      (userInArray) => userInArray === profileID
    );
    console.log({ resultInfindUserHasDisLiked: result });
    return !!DislikedUsersArray.find(
      (userInArray) => userInArray === profileID
    );
  };

  // fetch again when comments to reflect changes
  function getBlogs() {
    axios.get(`${baseURL}/blog/getBlogByBlogID/${blogID}`).then((res) => {
      setBlog(res.data.blog);
    });
  }

  useEffect(() => {
    const promise1 = axios.get(`${baseURL}/blog/getBlogByBlogID/${blogID}`);
    const promise2 = axios.get(`${baseURL}/blog/getComments/${blogID}`);

    axios.all([promise1, promise2]).then(
      axios.spread((...responses) => {
        const response1 = responses[0];
        const response2 = responses[1];

        setBlog(response1.data.blog);

        const resultHasLiked = findUserHasLiked(
          response1.data.blog.likedByUsersList,
          profileID
        );
        const resultHasDisliked = findUserHasDisliked(
          response1.data.blog.dislikedByUsersList,
          profileID
        );
        setHasLiked(resultHasLiked);
        setHasDisliked(resultHasDisliked);

        resultHasLiked
          ? setHasLikedIcon(<ThumbUp fontSize="large" />)
          : setHasLikedIcon(<ThumbUpOutlined fontSize="large" />);
        resultHasDisliked
          ? setHasDislikedIcon(<ThumbDown fontSize="large" />)
          : setHasDislikedIcon(<ThumbDownOutlined fontSize="large" />);

        //promise2
        setComments(response2.data.comments);
      })
    );
  }, []);

  // whenever statusupdates and is not empty
  useEffect(() => {
    if (commentStatusMessage === "") return;
    const timerID = setTimeout(
      () => setCommentStatusMessage(""),
      3000 /* 3 Seconds */
    );

    console.log("im runnning");
    return () => clearTimeout(timerID);
  }, [commentStatusMessage]);

  useEffect(() => {
    // our logic is based on blogDescription. both
    // scroll target: position is based on blogDescription height
    // timeout: is based on blogDescription charater length

    // if blog description is false we do nothing (no-op)
    if (!blog.blogDescription) return;

    // set timeout according to characters in blog description
    // using this to for view count
    const timerID = setTimeout(() => {
      setViewCountData((prev) => ({ ...prev, timeout: true }));
    }, (blog.blogDescription.length / 1000) * 30 * 1000);

    const scrollTarget = scrollTargetRef.current;

    // add scroll observer
    const io = new IntersectionObserver(([entry], _io) => {
      if (entry.isIntersecting) {
        console.log("in view");
        setViewCountData((prev) => ({ ...prev, scroll: true }));

        _io.unobserve(entry.target);
      }
    });
    io.observe(scrollTarget);

    return () => {
      clearTimeout(timerID);
      io.unobserve(scrollTarget);
    };
  }, [blog.blogDescription]);

  useEffect(() => {
    if (
      viewCountData.scroll &&
      viewCountData.timeout &&
      !viewCountData.hasSent
    ) {
      addViewApiHandler(blogID)
        .then(() => {
          setViewCountData({ hasSent: true });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [blogID, viewCountData]);

  const updateCommentStatusMessageParent = (message) => {
    setCommentStatusMessage(message);
  };
  const handleLike = () => {
    console.log("clicked");
    //handling loggedInUser , also handle not logged in User
    if (hasLiked === false && hasDisliked === false) {
      likeOnBlogAPIHandler(blogID, loggedInUserProfile).then((res) => {
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
      removeLikeOnBlogAPIHandler(blogID, loggedInUserProfile).then((res) => {
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
      likeOnBlogAPIHandler(blogID, loggedInUserProfile)
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

      removeDislikeOnBlogAPIHandler(blogID, loggedInUserProfile)
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
      dislikeOnBlogAPIHandler(blogID, loggedInUserProfile)
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
      removeDislikeOnBlogAPIHandler(blogID, loggedInUserProfile)
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
      removeLikeOnBlogAPIHandler(blogID, loggedInUserProfile)
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

      dislikeOnBlogAPIHandler(blogID, loggedInUserProfile)
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

  const viewAllHandler = () => {
    setLength(length + 5);
  };

  // eslint-disable-next-line no-lone-blocks

  return (
    <div className={`${style.main} ${style.container}`}>
      <div className={style.blogHeader}>
        <h1 className={style.title}>{blog.blogTitle}</h1>
        <div className={style.author}>
          <div className={style.authorContents}>
            <img
              className={style.avatar}
              src={blog.profilePicImageURL}
              alt=" "
            />
            <div className={style.published}>
              <small className={style.authorName}>{blog.profileName}</small>
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
        {/* for now giving inline style because they might accordingly our strategy */}
        <div style={{ position: "relative" }} className={style.blogContent}>
          <article>{blog.blogDescription}</article>
          {/* when this span comes into view then after `x`
           minutes we will send view count patch request to backend */}
          {blog.blogDescription && (
            <span
              ref={scrollTargetRef}
              style={{
                // moving a bit up so ~75% scroll through blog is counted as a view
                position: "absolute",
                bottom: "25%",
                left: 0,
                backgroundColor: "red",
                display: "inline-block",
                width: 32,
                height: 32,
              }}
            ></span>
          )}
        </div>
      </div>
      <div className={style.meta}>
        <div className={style.metaContent}>
          <div className={style.views}>
            <span className={style.viewCount}>{blog.viewCount}</span>

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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const commentDescription = e.target.elements.input.value;

            setCommentStatusMessage("");
            addCommentAPIHandler({
              commentDescription,
              blogID,
            })
              .then((response) => {
                console.log(JSON.stringify(response));
                setCommentStatusMessage(response.data.message);
                // re-fetch comments for blog when successful
                if (response.data.success === true) getBlogs();
                this.text.value = "";
              })
              .catch((error) => {
                console.log("It is not working");
              });
          }}
          className={style.commentForm}
        >
          <input
            id="mainInput"
            className={style.commentInput}
            name="input"
            type="text"
            placeholder="Add to the dicussion..."
          ></input>

          <button className={style.commentBtn} type="submit">
            Submit
          </button>
        </form>

        <p className={style.commentStatus}>
          {commentStatusMessage || <>&nbsp;</>}
        </p>

        <div className={styles.comment_count}>
          <h3>
            <span>{comments?.length}</span> Comments
            {console.log({ commentStatusMessage })}
          </h3>
        </div>

        <div className={styles.comments_container}>
          {setShowComment &&
            comments?.slice(0, length).map((comment) => (
              <Comments
                comment={comment}
                key={comment.commentID}
                authorProfileID={profileID}
                onDelete={(response) => {
                  // re-fetch comments for blog when successful
                  if (response.data.success === true) getBlogs();
                }}
                updateCommentStatusMessage={(commentStatusMessage) =>
                  updateCommentStatusMessageParent(commentStatusMessage)
                }
              />
            ))}
        </div>
      </div>
      {length < blog?.comments?.length && (
        <button onClick={viewAllHandler} className={style.view_all}>
          {viewMore}
        </button>
      )}
    </div>
  );
};

export default ViewBlog;
