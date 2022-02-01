import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import axios from "axios";

import baseURL from "../utils/baseURL";

import style from "../Pages/searchPage.module.css";
import Moment from "react-moment";

Moment.globalFormat = "MMM D , YYYY";

const SearchBlogCard = (blogProp) => {
  const { blog } = blogProp;
  const [authorName, setAuthorName] = useState("");
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

  useEffect(() => {
    console.log({ blogIDinBlogCard: blog.blogID, blog });
    axios
      .get(`${baseURL}/user/getUserDetails/${blog.userID}`)
      .then((res) => setAuthorName(res.data.user.firstName))
      .catch((err) => console.log(err));

    console.log({ blog });
    // console.log({ userDetails: user });
  }, []);

  return (
    <div>
      <div>
        <Link
          style={{ textDecoration: "none" }}
          to={`/${profileNameSlug}/${blogTitleSlug}--${blog.blogID}`}
        >
          <div className={style.blog_container}>
            {console.log({ blogInSBC: blog })}
            <img
              className={style.blog_image}
              src={`${blog.blogImageURL}`}
              alt=""
            />
            <div className={style.main}>
              <div className={style.blog_info}>
                {/* <h3>How to write a blog</h3> */}
                {blog.blogTitle}
                {/* <h5>May 9</h5> */}
                <h5>
                  <Moment>{blog?.timestamp?.$date}</Moment>
                </h5>
              </div>
              <div className={style.userContents_container}>
                <div className={style.userContents}>
                  <img
                    className={style.user_avatar}
                    src="//unsplash.it/40/40"
                    alt=" "
                  />
                  <div className={style.published}>
                    {/* <small className={style.userName}>Rahul Gupta</small> */}
                    <small className={style.userName}>{authorName}</small>
                  </div>
                </div>
                <div className={style.blog_content}>
                  {/* <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Dignissimos veritatis delectus, quibusdam fuga quo expedita
                  suscipit cupiditate nulla sint fugit.
                </p> */}
                  <p>{blog.blogDescription?.substring(0, 100)}</p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    filteredBlogs: state.filteredBlogs,
  };
};
export default connect(mapStateToProps)(SearchBlogCard);
