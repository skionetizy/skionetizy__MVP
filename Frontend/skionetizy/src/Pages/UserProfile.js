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
import PeopleIcon from "@material-ui/icons/People";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import GitHubIcon from '@material-ui/icons/GitHub';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';

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
            src="//unsplash.it/700/700"
            // src={profile.profileBannerImageURL}
            alt=""
          />
        </div>

        <section className={style.userProfile}>
          <div className={style.col1}>
            <img
              className={style.profileImage}
              src="//unsplash.it/120/120"
              // src={profile.profilePicImageURL}
              alt=""
            />
          </div>
          <div className={style.col2}>
            <h1>Angela Jolie</h1>
            <div className={style.profileDes}>
              <li>B. Tech CSE</li>
              <li>Vellore Institute of Technology</li>
              <li>Skionetizy</li>
              <li></li>
              <li></li>
              <li></li>
            </div>
            <p className={style.profileDes}>Mumbai, Maharashtra</p>
            <div className={style.profileFollow}>
              <PeopleOutlineIcon className={style.followIcon} />
              <div className={style.follow}>
                <small>Following</small>
                <h1>596</h1>
              </div>
              <PeopleOutlineIcon className={style.followIcon} />
              <div className={style.follow}>
                <small>Followers</small>
                <h1>1000</h1>
              </div>
            </div>
            <div className={style.userButton}>
            <Button variant="contained" color="primary">
              <EditIcon />Edit Profile
            </Button>
            <Button variant="outlined" color="primary" href="#outlined-buttons">
                30th July 2021
            </Button>
            </div>
          </div>
          <div className={style.social}>
            <h3>Social</h3>
            <ul>
              <li><LinkedInIcon className={style.socialIcons} /> LinkedIn</li>
              <li><GitHubIcon className={style.socialIcons} />Website</li>
            </ul>
          </div>
        </section>
        <div className={style.container}>
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
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={profile.profileName}
                      />
                      {/* <label htmlFor="lastName">Last Name</label>
                      <input type="text" name="lastName" id="lastName" /> */}
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
