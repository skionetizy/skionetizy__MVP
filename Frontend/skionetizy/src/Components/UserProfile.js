import React, { useState, useEffect } from "react";

import style from "./UserProfile.module.css";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import UserBlogsCard from "./UserBlogsCard";

import { getAllBlogsByUserAPIHandler } from "../API/blogAPIHandler";

import { getLoggedInUserID } from "../utils/AuthorisationUtils";

import axios from "axios";

const UserProfile = () => {
  const [author, setAuthorName] = useState("");
  const [blogs, setBlogs] = useState([]);

  const userID = getLoggedInUserID();

  const promise1 = getAllBlogsByUserAPIHandler(userID);
  // const promise2 = axios.get(`${baseURL}/user/getUserDetails/${userID}`);

  useEffect(() => {
    axios.all([promise1]).then(
      axios.spread((...responses) => {
        const response1 = responses[0];
        // console.log({ blogsInUserProfile: response1 });
        setBlogs(response1.blogs);

        // const response2 = responses[0];
        // setAuthorName(response2.data.user.firstName);
      })
    );
  }, []);
  return (
    <div className={style.main}>
      <div className={style.body}>
        <div className={style.profileDetails}>
          <img
            className={style.coverImage}
            src="//unsplash.it/700/700"
            alt=""
          />
          <img
            className={style.profileImage}
            src="//unsplash.it/120/120"
            alt=""
          />
        </div>
        <div className={style.container}>
          <div className={style.profileDescription}>
            <div className={style.bioDescription}>
              <div className={style.authorDetails}>
                <h2 className={style.author}>Rajath sharma</h2>
                <a className={style.link} href="#">
                  bit.ly/rajathsharma
                </a>
              </div>
              <div className={style.date}>
                <CalendarTodayIcon fontSize="small" />
                <p>June 2019</p>
              </div>
              <div className={style.followCount}>
                <p>
                  <span className={style.followingCount}>38</span> Following
                </p>
                <p>
                  <span className={style.followersCount}>5</span> Followers
                </p>
              </div>
              <div className={style.bio}>
                <p>
                  I am a person who loves to write tech content. I am also a
                  designer who has great perspection
                </p>
              </div>
            </div>
            <div className={style.buttons}>
              {/* <button className={`${style.buttons_followButton} ${style.secondaryButton}`}>Follow</button> */}
              <button className={style.buttons_editProfile}>
                Edit profile
              </button>
            </div>
          </div>

          <div className={style.divider}>
            <h2>My blogs</h2>
          </div>
          <div className={style.userBlogs}>
            {blogs &&
              blogs.map((blog, index) => (
                <UserBlogsCard key={index} blog={blog} />
              ))}

            {/* <UserBlogsCard />
            <UserBlogsCard />
            <UserBlogsCard />
            <UserBlogsCard /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
