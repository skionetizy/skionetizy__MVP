import React, { useState, useEffect } from "react";
import FormInput from "../Components/FormInput";
import useForm from "../hooks/useForm";
import { useParams, useHistory } from "react-router-dom";
import Moment from "react-moment";
import axios from "axios";

import { getAllBlogsByProfileAPIHandler } from "../API/blogAPIHandler";
import {
  getProfileDetailsAPIHandler,
  updateProfileDetails,
} from "../API/profileAPIHandler";
import {
  getLoggedInProfileID,
  getLoggedInUserID,
} from "../utils/AuthorisationUtils";
import Modal from "../Components/Modal";
import usePreviewImage from "../hooks/usePreviewImage";
import UserBlogsCard from "../Components/UserBlogsCard";

import style from "./UserProfile.module.css";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import baseURL from "../utils/baseURL";

Moment.globalFormat = "MMM D , YYYY";

const initailData = {
  profileBio: "",
  profileWebsiteURL: "",
  profilePicImage: null,
  rofileBannerImage: null,
};

const UserProfile = () => {
  const { data, getInputProps, handleChange, setData } = useForm(initailData);
  const [status, setStatus] = useState("idle");
  const { profileUserName } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [profile, setProfile] = useState({});
  const profileID = getLoggedInProfileID();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // const promise1 = getAllBlogsByProfileAPIHandler(profileID);
  // const promise2 = getProfileDetailsAPIHandler(profileID);

  const isAuthorisedUser = () => {
    return profileID === profile.profileID;
  };

  useEffect(() => {
    axios
      .get(`${baseURL}/profile/getBlogsAndProfile/${profileUserName}`)
      .then((res) => {
        console.log({ blogAndProfile: res.data });
        setProfile(res.data.profile);
        setBlogs(res.data.blogs);
      });
  }, []);

  function handleClose() {
    setShowEditModal(false);
  }

  // useEffect(() => {
  //   setStatus("loading");
  //   getProfileDetailsAPIHandler(profileUserName).then((response) => {
  //     setData({
  //       profileBio: response.profile.profileBio,
  //       profileWebsiteURL: response.profile.profileWebsiteURL,
  //     });
  //     setProfile(response.profile);
  //     setStatus("idle");
  //   });
  // }, [profileUserName, setData]);

  function handleSubmit(ev) {
    ev.preventDefault();
    const profileID = getLoggedInUserID();
    //change to getlogginedProfileID
    setStatus("loading");
    const formData = new FormData();
    formData.append("profileBio", data.profileBio);
    formData.append("profileWebsiteURL", data.profileWebsiteURL);
    updateProfileDetails(profile.profileID, formData);
    setStatus("success");
    setShowEditModal(false);
  }

  return (
    <div className={style.main}>
      <div className={style.body}>
        <div className={style.profileDetails}>
          <img
            className={style.coverImage}
            // src="//unsplash.it/700/700"
            src={profile.profileBannerImageURL}
            alt=""
          />

          <img
            className={style.profileImage}
            // src="//unsplash.it/120/120"
            src={profile.profilePicImageURL}
            alt=""
          />
        </div>
        <div className={style.container}>
          <div className={style.profileDescription}>
            <div className={style.bioDescription}>
              <div className={style.authorDetails}>
                <h2 className={style.author}>{profile.profileName}</h2>
                {/* <a className={style.link} href="/">
                  bit.ly/rajathsharma
                </a> */}
                <a className={style.link} href="#">
                  {profile.profileWebsiteURL}
                </a>
              </div>
              <div className={style.date}>
                <CalendarTodayIcon fontSize="small" />

                <p>
                  <Moment>{profile?.profileTimestamp?.$date}</Moment>
                </p>
              </div>
              <div className={style.followCount}>
                <p>
                  <span className={style.followingCount}>
                    {profile.FollowersCount}
                  </span>
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
                  onClick={() => setShowEditModal(true)}
                >
                  Edit profile
                </button>
              </div>
            )}
          </div>
          {showEditModal && (
            // this class makes it look like page on mobile
            <Modal>
              <div className={style.wrapper}>
                <button className={style.closeBtn} onClick={handleClose}>
                  &times;
                </button>
                <h1>Edit Profile</h1>
                <form onSubmit={handleSubmit}>
                  <div className={style.inputs}>
                    <div className={style.firstLast}>
                      <label htmlFor="firstName">First Name</label>
                      <input type="text" name="firstName" id="firstName" />
                      <label htmlFor="lastName">Last Name</label>
                      <input type="text" name="lastName" id="lastName" />
                    </div>
                    {/* <div>
                      <label htmlFor="lastName">Joining Date</label>
                      <input type="date" name="lastName" id="lastName" />
                    </div> */}
                    <hr className={style.horizontalLine} />
                    <div className={style.bottom}>
                      <div>
                        <label htmlFor="">Website Link</label>
                        <input
                          className={style.url}
                          {...getInputProps("profileWebsiteURL")}
                        />
                      </div>
                      <div className={style.bio}>
                        <label htmlFor="Bio">Bio</label>
                        <textarea id="Bio" {...getInputProps("profileBio")} />
                      </div>
                    </div>
                  </div>
                  <button type="submit" className={style.savebtn}>
                    Save
                  </button>
                </form>
              </div>
            </Modal>
          )}

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
