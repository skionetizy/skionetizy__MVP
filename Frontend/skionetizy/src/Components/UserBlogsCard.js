import React from "react";
import { FiEdit2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import styles from "./UserBlogsCard.module.css";

export default function UserBlogsCard({ blog, profile }) {
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

          {blogStatus && (
            <span className={styles.blogStatus}>{blogStatus}</span>
          )}
        </div>

        <p className={styles.blogDescription}>
          {blogDescription.substr(0, 200)}...
        </p>
      </div>
    </div>
  );
}
