import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbDownAltIcon from "@material-ui/icons/ThumbDownAlt";
import axios from "axios";
// import moment from 'moment'; // uninstall this later
// import Moment from 'react-moment';
import baseURL from "../utils/baseURL";
import style from "../Pages/exploreBlogs.module.css";
import Moment from "react-moment";

Moment.globalFormat = "MMM D , YYY ";

const BlogCard = ({ blog }) => {
  // const [authorName, setAuthorName] = useState("");

  // useEffect(() => {
  //   console.log({ blogIDinBlogCard: blog.blogID, blog });
  //   axios
  //     .get(`${baseURL}/user/getUserDetails/${blog.userID}`)
  //     .then((res) => setAuthorName(res.data.user.firstName))
  //     .catch((err) => console.log(err));

  //   console.log({ blog });
  //   // console.log({ userDetails: user });
  // }, []);

  // const date = blog.timestamp.split("T")[0];
  return (
    <div>
      <Link
        style={{ textDecoration: "none" }}
        to={`/view-blog/${blog.blogID}/${blog.userID}`}
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
                <div className={style.title}>
                  <h3>{blog.blogTitle}</h3>
                </div>
                <div className={style.author}>
                  <img
                    className={style.avatar}
                    // src="//unsplash.it/40/40"
                    src={`${blog.profilePicImageURL}`}
                    alt=""
                  />

                  <small className={style.authorName}>{blog.profileName}</small>
                </div>
                <div>
                  <div className={style.dayLikesDislikes}>
                    {/* <h4 class={style.date}>May 4</h4> */}
                    <h4 class={style.date}>
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
