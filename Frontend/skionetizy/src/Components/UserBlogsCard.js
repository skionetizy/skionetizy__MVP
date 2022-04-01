import React from "react";
import { FiEdit2 } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import BlogStatusBadge from "../Components/BlogStatusBadge";
import styles from "./UserBlogsCard.module.css";

export default function UserBlogsCard({ blog, profile, isOwner }) {
  const dispatch = useDispatch();
  const { blogImageURL, blogTitle, blogDescription, blogStatus, timestamp } =
    blog;
  const { profilePicImageURL, profileName } = profile;
  const blogPublishDate = new Date(timestamp.$date).toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
  });

  return (
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
          <p>{blogPublishDate}</p>
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

        <p className={styles.blogDescription}>
          {blogDescription.substr(0, 200)}...
        </p>
      </div>
      {isOwner?
        <Link
          to="/addBlogDetailsMarkdown"
          onClick={() => {
            dispatch({ type: "MARKDOWN_MODE", payload: "update" });
            localStorage.setItem("CURRENT_EDITING_BLOG", JSON.stringify(blog));
          }}
          className={styles.editDraftBtn}
        >
          <FiEdit2 className={styles.edit_icon} width="1em" />
        </Link>
        :<></>}
    </div>
  );
}
