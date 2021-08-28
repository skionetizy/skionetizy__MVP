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
            // src="//unsplash.it/700/700"
            src='https://lh3.googleusercontent.com/zidTLyBQ7Z46uLdcPFTSYdxsGMNzjdLOJ6jG4xGbqXVfrHkEm2nsa3Q_nZYqp51RfeApLHTgCMX6UkJFqiAJKIpZDa65SCPy7WZQzd6fmb-7JMIeoA76t1bY44wCErusB2V3H5cqTNVCATDWziU63fUdTDzLCGHNQV-0iPoHUyAMACtbB27r-kqGTlZ5RzPHg4JFhPfWxEXi0VL-PnVpMRCRLsGhThf90C0BYhzwKfHCB2iXVpWsSFWLtESgTCsxNGn3LAXm34LxN9B0PrigHjIUzY75GYxjRIvUEU69tNhQcYx5zbWKcRV-roL6iK0qGy1snILuRWqma4SWZeb7ZKAVk8kXFq0PqXGRGNqVZc7-bi_5i7sSkr6bzVbSn_7XHJMhOZKatdYen__DOdSt84iRjkUT4IuMa1JiTVhwjecPqJMKOrRfMh110BPuiHcHzDcaanP-s0Q56c95ONYVJxq4IKE6nA1jT_ZQ0qVUMlgeZU5_J_FFEPmJRMBoSxqLTVfacuIoZr4wlHzy6gv2jBULjTetV4Ee6gGgE1BO7P-ZYZirwBOD0fe9QYprPjkeUA-80fX_ceWN6peVBUzqFNObZfZgHFTbnbhzdZXB1SNw-BqcyGdXkC4dUJuZOT3XQn3s-mAHQaJ9GCA0R4Twp_jBGNCzO37azvoIQPqqXgVdJwPbm3Fh5uhBzB_wr4AlwjtgqGCp1r_wEF2zNymj5aw=w1588-h893-no?authuser=0'
            // src={profile.profileBannerImageURL}
            alt=""
          />
        </div>

        <section className={style.userProfile}>
          <div className={style.col1}>
            <img
              className={style.profileImage}
              // src="//unsplash.it/120/120"
              src="https://lh3.googleusercontent.com/38k61zIuLjAqGFrDDR0_XV06j9MqUBlekxZ1atB0BCvwbCnYS28LBdMXVUViCRfv1rJPrJUVYGDzyhOsoaz4YiQ8mX5HRL024vPIMNe9Msc3TBEWIMzAg9IwRQspPbb3EbIgyfZB0g1DM3CQqUFlzEjsYr35Ven_zd_kEMetELQ2pk1Pm8D0hI4Og9lBbXSlrayFLux61kmF2p1Oo7bJx6Fn7a-87AdUPtT2Ebq3e8r0hALRs6kY-C5kqjwOVuJl8JbLRBOLkOaYcbZnnQMmtfXBV_O2XNs4f8WoxYKL919bMY6kIz0WBB2TGFFlTrQsZfbuX5P_HYtloXX-oQ5IelMjWwnxRmVFO4XmJ9H9b7LxJcHUTkA4Nhky2g8jjshualXfIfuLFPhJwJm7-nL--U-DMNNHGNoJnRl2NEKwf4_9N1NXwFezFdftRIubh5MgiuPjaPDUvBZl2mFCAv_FCALeXotK2z7yMLktufNbmw-wIACqGJSIXlk-MyK7s9SeZzevKAYFz53OX2khFp9isjoAiJmbdA7RdngInB76foVcnctef7ISINZEKnWq0tyDkxOynbyHFqicQSVKNzTSenYgSVKVXuRerdkJFSHk8O7PJH26b5iyE4tDjFAXnZS4Fey2bmABMuH9ehdfGOHNDtTjNoZBBxtbPivAxdXKh3yoggn-Tcn5eCkMfGhxKXZdX4MiOmJorIhiryn63Pi5i24=w889-h893-no?authuser=0"
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

{/* Previous code section for UserProfile section         
<div className={style.profileDescription}>
            <div className={style.bioDescription}>
              <div className={style.authorDetails}>
                <h2 className={style.author}>{profile.profileName}</h2>
                 <a className={style.link} href="/">
                  bit.ly/rajathsharma
                </a> 
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
                 <p>
                  <span className={style.followersCount}>5</span> Followers
                </p>
                <p>
                  <span className={style.followersCount}>
                    {profile.FollowingCount}
                  </span>{" "}
                  Followers
                </p>
              </div>
               <div className={style.bio}>
                <p>
                  I am a person who loves to write tech content. I am also a
                  designer who has great perspection
                </p>
              </div> 
              <div className={style.bio}>
                <p>{profile.profileBio}</p>
              </div>
            </div>
           
          </div>*/}
        <div className={style.container}>
        {isAuthorisedUser() && (
              <div className={style.buttons}>
                <button className={`${style.buttons_followButton} ${style.secondaryButton}`}>Follow</button> 
                <button
                  className={style.buttons_editProfile}
                  onClick={() => setShowEditModal(true)}
                >
                  Edit profile
                </button>
              </div>
            )}
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
