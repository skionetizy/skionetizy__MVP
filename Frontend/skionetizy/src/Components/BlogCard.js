import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import VisibilityIcon from "@material-ui/icons/Visibility";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbDownAltIcon from "@material-ui/icons/ThumbDownAlt";
import axios from "axios";
// import moment from 'moment'; // uninstall this later
// import Moment from 'react-moment';
import baseURL from "../utils/baseURL";
import style from "../Pages/exploreBlogs.module.css";
import Moment from "react-moment";

Moment.globalFormat = "MMM D , YYY ";

const BlogCard = ({ blog, isAdmin = false }) => {
  useEffect(async () => {
    const res = await axios.get(`${baseURL}/blog/getComments`);
    console.log("comm", res);
  }, []);

  const blogTitle = blog?.blogTitle
  const blogTitleSlug = blogTitle.toLowerCase().replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');

  console.log('blogTitle ->', blogTitle)
  console.log('blogTitleSlug ->', blogTitleSlug)

  console.log("blog Object->", blog)

  const profileName = blog?.profileName
  const profileNameSlug = profileName?.toLowerCase().replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');

  console.log('profileName ->', profileName)
  console.log('profileNameSlug ->', profileNameSlug)

  return (
    <div>
      <Link
        style={{
          textDecoration: "none",
          display: "inline-block",
          height: "100%",
          width: "100%",
        }}
        // to={
        //   isAdmin
        //     ? `/admin/view-blog/${blog.blogID}/${blog.profileID}`
        //     : `/view-blog/${blog.blogID}/${blog.profileID}`
        // }
        to={
          isAdmin
            ? `/admin/${profileNameSlug}/${blogTitleSlug}--${blog.blogID}`
            : `/${profileNameSlug}/${blogTitleSlug}--${blog.blogID}`
        }
      >
        <div className={style.main}>
          <div className={style.cardBox}>
            <img
              className={style.blogCover}
              src={`${blog.blogImageURL}`}
              alt=""
            />
            <div className={style.blogDetails}>
              <div className={style.text}>
                <h3 className={style.title}>{blog.blogTitle}</h3>
                <div className={style.author}>
                  <img
                    className={style.avatar}
                    // src="//unsplash.it/40/40"
                    src={`${blog.profilePicImageURL}`}
                    alt=""
                  />
                  <div className={style.datenamecontainer}>
                    <small className={style.authorName}>
                      {blog.profileName}
                    </small>
                    <small class={style.date}>
                      <Moment>{blog?.timestamp?.$date}</Moment>
                    </small>
                  </div>
                </div>
                <div>
                  <div className={style.iconContainer}>
                    {/* <h4 class={style.date}>May 4</h4> */}
                    <div className={style.icon}>
                      <VisibilityIcon className={style.viewIcon} />
                      <span>{blog.viewCount}</span>
                    </div>
                    <div className={style.icon}>
                      <ThumbUpAltIcon className={style.ThumbUpAlt} />
                      <span>{blog.likesCount}</span>
                    </div>

                    {/* <div className={style.icon}>
                      <ThumbDownAltIcon className={style.ThumbDownAlt} />
                      <span>{blog.dislikesCount}</span>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
