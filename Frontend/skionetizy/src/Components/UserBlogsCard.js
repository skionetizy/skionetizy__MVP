import React from "react";

import style from "./UserProfile.module.css";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbDownAltIcon from "@material-ui/icons/ThumbDownAlt";

import Moment from "react-moment";

Moment.globalFormat = "MMM D , YYYY";

const UserBlogsCard = (blogFromUserProfile) => {
  // console.log({ blogInUserBlogsCard: blog });
  const { blog } = blogFromUserProfile;
  return (
    <div className={style.container}>
      <div className={style.row}>
        <img className={style.blogImage} src={`${blog.blogImageURL}`} alt="" />
        <div className={style.blogInfo}>
          <div className={style.blogTitle}>{blog.blogTitle}</div>
          <div className={style.dayLikesDislikes}>
            <h4 className={style.date}>
              <Moment>{blog?.timestamp?.$date}</Moment>
            </h4>
            <div className={style.pushRight}>
              <span>{blog.likesCount}</span>
              <ThumbUpAltIcon className={style.ThumbUpAlt} />
            </div>
            <div className={style.thumbDown}>
              <span>{blog.dislikesCount}</span>
              <ThumbDownAltIcon className={style.ThumbDownAlt} />
            </div>
          </div>
          <div className={style.actions}>
            <button className={`${style.deleteBlog} ${style.secondaryButton}`}>
              Delete
            </button>
            <button className={style.editBlog}>Edit Blog</button>
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default UserBlogsCard;
