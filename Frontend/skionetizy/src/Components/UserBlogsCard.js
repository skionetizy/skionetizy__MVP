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
        {/* <img
          className={style.blogImage}
          src="https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt=""
        /> */}
        <img className={style.blogImage} src={`${blog.blogImageURL}`} alt="" />
        <div className={style.blogInfo}>
          {/* <div className={style.blogTitle}>How to write a blog</div> */}
          <div className={style.blogTitle}>{blog.blogTitle}</div>
          <div className={style.dayLikesDislikes}>
            {/* <h4 className={style.date}>May 4, 2021</h4> */}
            <h4 className={style.date}>
              <Moment>{blog?.timestamp?.$date}</Moment>
            </h4>
            <div className={style.pushRight}>
              {/* <span>241</span> */}
              {/* <span>128</span> */}
              <span>{blog.likesCount}</span>
              <ThumbUpAltIcon className={style.ThumbUpAlt} />
            </div>
            <div className={style.thumbDown}>
              {/* <span>10</span> */}
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
