import React, { useState, useEffect } from "react";

import style from "./UserProfile.module.css";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import UserBlogsCard from "../Components/UserBlogsCard";

import { getAllBlogsByProfileAPIHandler } from "../API/blogAPIHandler";
import { getProfileDetailsAPIHandler } from "../API/profileAPIHandler";

import { getLoggedInUserID } from "../utils/AuthorisationUtils";

import axios from "axios";
import { useParams, useHistory } from "react-router-dom";

import Moment from "react-moment";

Moment.globalFormat = "MMM D , YYYY";

const UserProfile = () => {
  // const { profileID } = useParams();
  const { profileUserName } = useParams();
  const history = useHistory();
  const [blogs, setBlogs] = useState([]);

  const [profile, setProfile] = useState({});

  const userID = getLoggedInUserID();

  // const promise1 = getAllBlogsByProfileAPIHandler(profileID);

  // const promise2 = axios.get(`${baseURL}/user/getUserDetails/${userID}`);
  // const promise2 = getProfileDetailsAPIHandler(profileID);

  const isAuthorisedUser = () => {
    return userID === profile.userID;
  };

  useEffect(() => {
    const promise1 = getAllBlogsByProfileAPIHandler(profileUserName);
    const promise2 = getProfileDetailsAPIHandler(profileUserName);
    axios.all([promise1, promise2]).then(
      axios.spread((...responses) => {
        const response1 = responses[0];
        const response2 = responses[1];
        console.log({ blogsInUserProfile: response1 });
        console.log({ profileInAxiosAll: response2 });
        setBlogs(response1.blogs);
        setProfile(response2.profile);

        // const response2 = responses[0];
        // setAuthorName(response2.data.user.firstName);
      })
    );
  }, []);

  console.log(`userID`, userID);
  console.log(`profile.userID`, profile.userID);
  console.log(`profile`, profile);
  console.log(`isAuthorisedUser()`, isAuthorisedUser());

  return (
    <div className={style.main}>
      <div className={style.body}>
        <div className={style.profileDetails}>
          <img
            className={style.coverImage}
            src="//unsplash.it/700/700"
            alt=""
          />
          {/* <img
            className={style.coverImage}
            src={`${profileBannerImage}`}
            alt=""
          /> */}
          <img
            className={style.profileImage}
            src="//unsplash.it/120/120"
            alt=""
          />
          {/* <img
            className={style.profileImage}
            src={`${profilePicImage}`}
            alt=""
          /> */}
        </div>
        <div className={style.container}>
          <div className={style.profileDescription}>
            <div className={style.bioDescription}>
              <div className={style.authorDetails}>
                {/* <h2 className={style.author}>Rajath sharma</h2> */}
                <h2 className={style.author}>{profile.profileName}</h2>
                <a className={style.link} href="#">
                  bit.ly/rajathsharma
                </a>
                {/* <a className={style.link} href="#">
                  {profile.profileWebsiteURL}
                </a> */}
              </div>
              <div className={style.date}>
                <CalendarTodayIcon fontSize="small" />
                {/* <p>June 2019</p> */}
                <p>
                  <Moment>{profile?.profileTimestamp?.$date}</Moment>
                </p>
              </div>
              <div className={style.followCount}>
                {/* <p>
                  <span className={style.followingCount}>38</span> Following
                </p> */}
                <p>
                  <span className={style.followingCount}>
                    {profile.FollowersCount}
                  </span>{" "}
                  Following
                </p>
                {/* <p>
                  <span className={style.followersCount}>5</span> Followers
                </p> */}
                <p>
                  <span className={style.followersCount}>
                    {profile.FollowingCount}
                  </span>{" "}
                  Followers
                </p>
              </div>
              {/* <div className={style.bio}>
                <p>
                  I am a person who loves to write tech content. I am also a
                  designer who has great perspection
                </p>
              </div> */}
              <div className={style.bio}>
                <p>{profile.profileBio}</p>
              </div>
            </div>
            {isAuthorisedUser() && (
              <div className={style.buttons}>
                {/* <button className={`${style.buttons_followButton} ${style.secondaryButton}`}>Follow</button> */}
                <button
                  className={style.buttons_editProfile}
                  onClick={() => history.push(`/edit/${profileUserName}`)}
                >
                  Edit profile
                </button>
              </div>
            )}
          </div>

          <div className={style.divider}>
            <h2>My blogs</h2>
          </div>
          <div className={style.userBlogs}>
            {blogs &&
              blogs.map((blog, index) => (
                <UserBlogsCard
                  key={index}
                  blog={blog}
                  isAuthorisedUser={isAuthorisedUser()}
                />
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
