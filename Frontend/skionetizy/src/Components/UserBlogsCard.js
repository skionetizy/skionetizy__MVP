import { convertFromRaw, convertToRaw } from "draft-js";
import React from "react";
import { FiEdit2 } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import BlogStatusBadge from "../Components/BlogStatusBadge";
import styles from "./UserBlogsCard.module.css";
import { mdToDraftjs } from "draftjs-md-converter";
import { REDIRECTED_FROM } from "../utils/localStorageKeys";
import EditIcon from "../Assets/EditIcon.svg";

export default function UserBlogsCard({ blog, profile, isOwner }) {
  const dispatch = useDispatch();
  const { blogID, blogImageURL, blogTitle, blogDescription, blogStatus, timestamp } =
    blog;
  const { profilePicImageURL, profileName } = profile;
  const blogPublishDate = new Date(timestamp.$date).toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
  });

  const redirecting = () => {
    localStorage.setItem(REDIRECTED_FROM, `/${profileName}/${blogTitle}/${blogID}`);
  }

  // https://stackoverflow.com/questions/44227270/regex-to-parse-image-link-in-markdown
  var regex=/!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/g
  return (
    <Link className={styles.blogLink} onclick={redirecting} to={`/${profileName}/${blogTitle}/${blogID}`}>
      <div className={styles.wrapper}>
        <img
          src={blogImageURL}
          className={styles.blogImage}
          alt={`${blogTitle}'s`}
        />

        {/* details */}
        <div className={styles.detailsWrapper}>
          <div className={styles.titleWrapper}>
            <p className={styles.blogTitle}>{blogTitle}</p>
            <p className={styles.blogDate}>{blogPublishDate}</p>
          </div>

          <div className={styles.profileDetailsWrapper}>
            <div className={styles.profileWrapper}>
              <img
                src={profilePicImageURL}
                className={styles.profileImage}
                alt={profileName}
              />

              <p className={styles.profileName}>{profileName}</p>
            </div>

            {isOwner ? blogStatus && (
              <BlogStatusBadge variant={blogStatus} className={styles.blogStatus}>
                {blogStatus}
              </BlogStatusBadge>
            ):<></>}
          </div>

          {/* <p className={styles.blogDescription}>
            {blogDescription.substr(0, 200)}...
          </p> */}
          <ReactMarkdown className={styles.blogDescription} source={blogDescription.substr(0,100).replace(regex, '')} />
        </div>
        {isOwner?
          <Link
            to="/addBlogDetailsMarkdown"
            onClick={() => {
              dispatch({ type: "MARKDOWN_MODE", payload: "update" });
              localStorage.setItem("CURRENT_EDITING_BLOG", JSON.stringify(blog));
              let contentState = convertFromRaw(mdToDraftjs(blog.blogDescription));
              localStorage.setItem("content",JSON.stringify(convertToRaw(contentState)));
            }}
            className={styles.editDraftBtn}
          >
            <img src={EditIcon} alt="edit" className={styles.edit_icon} width="1em" />
          </Link>
          :<></>}
      </div>
    </Link>
  );
}
