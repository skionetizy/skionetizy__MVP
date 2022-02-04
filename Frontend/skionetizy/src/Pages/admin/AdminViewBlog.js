import ShareIcon from "@material-ui/icons/Share";
import ThumbDown from "@material-ui/icons/ThumbDown";
import ThumbDownOutlined from "@material-ui/icons/ThumbDownOutlined";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ThumbUpOutlined from "@material-ui/icons/ThumbUpOutlined";
import VisibilityIcon from "@material-ui/icons/Visibility";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import Moment from "react-moment";
import { Link, useParams } from "react-router-dom";
import {
  addCommentAPIHandler,
  addViewApiHandler,
  dislikeOnBlogAPIHandler,
  likeOnBlogAPIHandler,
  removeDislikeOnBlogAPIHandler,
  removeLikeOnBlogAPIHandler,
} from "../../API/blogAPIHandler";
import Spinner from "../../Components/Spinner";
import { Center } from "../../Components/Layouts";
import Comments from "../../Components/comments";
import styles from "../../Components/comments.module.css";
import FollowButton from "../../Components/FollowButton";
import LoginFormModal from "../../Components/LoginFormModal";
import Modal from "../../Components/Modal";
import ShareBlogModal from "../../Components/ShareBlogModal";
import SignupForm from "../../Components/SignupForm";
import VerifyEmailModal from "../../Components/VerifyEmailModal";
import useAuth from "../../hooks/useAuth";
import useMutate from "../../hooks/useMutate";
import { isAuthenticated } from "../../utils/AuthorisationUtils";
import baseURL from "../../utils/baseURL";
import style from "../ViewBlog.module.css";
import ReactMarkdown from "react-markdown";
import BlogStatusBadge from "../../Components/BlogStatusBadge";
import BlogChangeStatusModal from "../../Components/BlogChangeStatusModal";

const KEYWORDS_LOCAL_KEY = "blogsKeywords";

Moment.globalFormat = "MMM D , YYYY";

const ViewBlog = () => {
  // const { blogID, profileID } = useParams();
  // const { profileNameSlug, blogTitleSlugAndblogID } = useParams();
  const { profileNameSlug, blogTitleSlug, blogID } = useParams();

  // const blogTitleSlug = blogTitleSlugAndblogID?.split("--")[0];
  // const blogID = blogTitleSlugAndblogID?.split("--")[1];
  const auth = useAuth();

  const loggedInUserProfile = auth.profile?.profileID;
  const [blog, setBlog] = useState({});
  const [showComment, setShowComment] = useState(true);
  const [length, setLength] = useState(3);
  const [viewMore, setViewMore] = useState("View more");
  const [showModal, setShowModal] = useState("");
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [commentStatusMessage, setCommentStatusMessage] = useState("");
  const [viewCountData, setViewCountData] = useState({
    timeout: false,
    scroll: false,
    hasSent: false,
  });
  const [comments, setComments] = useState();
  const addCommentMutation = useMutate({
    mutateFn: (commentDescription) => {
      return addCommentAPIHandler({
        profileID: auth.profile?.profileID,
        commentDescription,
        blogID,
      });
    },

    onSuccess: (res) => {
      setCommentStatusMessage(res.data.message);
      // re-fetch comments for blog when successful
      if (res.data.success === true) getComments();
    },

    onFailure: () => {
      setCommentStatusMessage("Failed to upload");
    },
  });
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

  function getComments() {
    axios.get(`${baseURL}/blog/getComments/${blogID}`).then((res) => {
      setComments(res.data.comments);
    });
  }

  useEffect(() => {
    const cachedBlogKey = "GOOGLE_OAUTH_CURRENT_BLOG";
    const cachedBlog = localStorage.getItem(cachedBlogKey);
    let promise1;
    if (cachedBlog) {
      // make it look like a AxiosResponse
      promise1 = { data: { blog: JSON.parse(cachedBlog) } };

      // remove cache so next time we get fresh data from backend
      localStorage.removeItem(cachedBlogKey);
    } else {
      promise1 = axios.get(`${baseURL}/blog/getBlogByBlogID/${blogID}`);
    }
    const promise2 = axios.get(`${baseURL}/blog/getComments/${blogID}`);

    console.log(promise1);

    axios.all([promise1, promise2]).then(
      axios.spread((...responses) => {
        const response1 = responses[0];
        const response2 = responses[1];

        const allKeywords = JSON.parse(
          localStorage.getItem(KEYWORDS_LOCAL_KEY) || "{}"
        );
        const keywords = allKeywords[blogID];
        setBlog({ ...response1.data.blog, keywords });

        const resultHasLiked = findUserHasLiked(
          response1.data.blog.likedByUsersList,
          blog.profileID
        );
        const resultHasDisliked = findUserHasDisliked(
          response1.data.blog.dislikedByUsersList,
          blog.profileID
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

    if (!isAuthenticated() && showModal === "") {
      setTimeout(() => {
        setShowModal("LOGIN_FORM");
      }, 20000);
    }
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
    if (!loggedInUserProfile) {
      setShowModal("LOGIN_FORM");
    } else if (hasLiked === false && hasDisliked === false) {
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

    if (!loggedInUserProfile) {
      setShowModal("LOGIN_FORM");
    } else if (hasDisliked === false && hasLiked === false) {
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

  return (
    <>
      <div className={`${style.main} ${style.container}`}>
        {blog.blogID && (
          <Helmet>
            <meta name="description" content={blog.keywords} />
            <meta name="twitter:image" content={blog.blogImageURL} />
            <meta name="twitter:title" content={blog.blogTitle} />
            <meta
              name="twitter:description"
              content={blog.blogDescription.substr(0, 70) + "..."}
            />
            <meta name="twitter:site" content={window.location.href} />
          </Helmet>
        )}

        <p style={{ textAlign: "right", marginTop: "2rem" }}>
          <button
            style={{ border: "none", background: "none" }}
            onClick={() => {
              setShowModal("BLOG_STATUS_MODAL");
            }}
          >
            <BlogStatusBadge variant={blog.blogStatus || "Draft"}>
              {blog.blogStatus || "Draft"}
            </BlogStatusBadge>
          </button>
        </p>

        <div className={style.blogHeader}>
          <h1 className={style.title}>{blog.blogTitle}</h1>

          <div className={style.author}>
            <div className={style.authorContents}>
              <Link to={`/${blog.profileUserName}`}>
                <img
                  className={style.avatar}
                  src={blog.profilePicImageURL}
                  alt=" "
                />
              </Link>

              <div className={style.published}>
                <Link to={`/${blog.profileUserName}`}>
                  <small className={style.authorName}>{blog.profileName}</small>
                </Link>
                <small className={style.publishedDate}>
                  Published on <Moment>{blog?.timestamp?.$date}</Moment>
                </small>
              </div>
            </div>
            <div className={style.buttons}>
              {!!blog.blogID && (
                <FollowButton othersProfileID={blog.profileID} />
              )}

              <button
                className={`${style.button} ${style.shareButton}`}
                onClick={() => setShowModal("SHARE_BLOG")}
                disabled={!blog.blogID}
              >
                Share <ShareIcon fontSize="small" />
              </button>

              {showModal === "SHARE_BLOG" ? (
                <ShareBlogModal blog={blog} onClose={() => setShowModal("")} />
              ) : showModal === "BLOG_STATUS_MODAL" ? (
                <BlogChangeStatusModal
                  currentStatus={blog.blogStatus}
                  onClose={() => setShowModal("")}
                />
              ) : null}
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
            <ReactMarkdown source={blog.blogDescription} />
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
                  backgroundColor: "transparent",
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

            <div className={`${style.likes}`}>
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
            </div>
          </div>
        </div>
        <div className={styles.comments}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!loggedInUserProfile) {
                setShowModal("LOGIN_FORM");
                return;
              }

              const commentDescription = e.target.elements.input.value;
              setCommentStatusMessage("");
              addCommentMutation.mutate(commentDescription).then(() => {
                e.target.reset();
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
            />

            <button
              className={style.commentBtn}
              disabled={addCommentMutation.isLoading}
              type="submit"
            >
              {addCommentMutation.isLoading && <Spinner />}
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
            {showComment &&
              comments?.slice(0, length).map((comment) => (
                <Comments
                  comment={comment}
                  key={comment.commentID}
                  authorProfileID={blog.profileID}
                  onDelete={(response) => {
                    // re-fetch comments for blog when successful
                    if (response.data.success === true) getComments();
                  }}
                  updateCommentStatusMessage={(commentStatusMessage) =>
                    updateCommentStatusMessageParent(commentStatusMessage)
                  }
                />
              ))}
          </div>
        </div>
        {length < blog?.comments?.length && (
          <Center>
            <button onClick={viewAllHandler} className={style.view_all}>
              {viewMore}
            </button>
          </Center>
        )}
      </div>

      {/* Modals */}
      {showModal === "LOGIN_FORM" ? (
        <LoginFormModal
          onLogin={(_user, error) => {
            if (error) return;
            setShowModal("");
          }}
          onSignupClick={() => {
            setShowModal("SIGNUP_FORM");
          }}
        />
      ) : showModal === "SIGNUP_FORM" ? (
        <Modal>
          <SignupForm
            className={style.signupModalWrapper}
            onLoginClick={() => setShowModal("LOGIN_FORM")}
            onSignup={(user, error) => {
              if (error) return;
              setShowModal("VERIFY_EMAIL");
            }}
          />
        </Modal>
      ) : showModal === "VERIFY_EMAIL" ? (
        <VerifyEmailModal onClose={() => setShowModal("")} />
      ) : null}
    </>
  );
};

export default ViewBlog;
