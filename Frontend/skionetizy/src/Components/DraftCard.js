import { style } from "@material-ui/system";
import React from "react";
import { FiEdit, FiEdit2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import styles from "./DraftCard.module.css";

export default function DraftCard({ blog, profile }) {
  const { blogImageURL, blogTitle, blogDescription, timestamp } = blog;
  const { profilePicImageURL, profileName } = profile;
  const blogPublishDate = new Date(timestamp.$date).toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
  });

  return (
    <div>
      <img src={blogImageURL} />

      {/* details */}
      <div>
        <div className={styles.titleWrapper}>
          <p>{blogTitle}</p>
          <p>{blogPublishDate}</p>
        </div>

        <div className={styles.profileDetailsWrapper}>
          <img src={profilePicImageURL} />

          <p>{profileName}</p>
        </div>

        <p>{blogDescription}</p>
      </div>

      <Link to="/editBlog">
        <FiEdit2 width="1em" />
      </Link>
    </div>
  );
}
