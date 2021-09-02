import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import { Link, useParams, useRouteMatch, NavLink } from "react-router-dom";
import {
  getProfileDetailsAPIHandler,
  updateProfileDetails,
} from "../API/profileAPIHandler";
import EditProfileDetails from "../Components/EditProfileDetails";
import Modal from "../Components/Modal";
import Spinner from "../Components/Spinner";
import UserBlogsCard from "../Components/UserBlogsCard";
import usePreviewImage from "../hooks/usePreviewImage";
import { getLoggedInProfileID } from "../utils/AuthorisationUtils";
import baseURL from "../utils/baseURL";
import clsx from "../utils/clsx";
import validateImage from "../utils/validateImage";
import style from "./UserProfile.module.css";
import { Switch, Route } from "react-router-dom";
import DraftCard from "../Components/DraftCard";
import UserProfileDrafts from "./UserProfileDrafts";
import { FiEdit2, FiCamera } from "react-icons/fi";
import UserProfileBlogs from "./UserProfileBlogs";

Moment.globalFormat = "MMM D , YYYY";

const placeholderImageSrc =
  "https://lh3.googleusercontent.com/zidTLyBQ7Z46uLdcPFTSYdxsGMNzjdLOJ6jG4xGbqXVfrHkEm2nsa3Q_nZYqp51RfeApLHTgCMX6UkJFqiAJKIpZDa65SCPy7WZQzd6fmb-7JMIeoA76t1bY44wCErusB2V3H5cqTNVCATDWziU63fUdTDzLCGHNQV-0iPoHUyAMACtbB27r-kqGTlZ5RzPHg4JFhPfWxEXi0VL-PnVpMRCRLsGhThf90C0BYhzwKfHCB2iXVpWsSFWLtESgTCsxNGn3LAXm34LxN9B0PrigHjIUzY75GYxjRIvUEU69tNhQcYx5zbWKcRV-roL6iK0qGy1snILuRWqma4SWZeb7ZKAVk8kXFq0PqXGRGNqVZc7-bi_5i7sSkr6bzVbSn_7XHJMhOZKatdYen__DOdSt84iRjkUT4IuMa1JiTVhwjecPqJMKOrRfMh110BPuiHcHzDcaanP-s0Q56c95ONYVJxq4IKE6nA1jT_ZQ0qVUMlgeZU5_J_FFEPmJRMBoSxqLTVfacuIoZr4wlHzy6gv2jBULjTetV4Ee6gGgE1BO7P-ZYZirwBOD0fe9QYprPjkeUA-80fX_ceWN6peVBUzqFNObZfZgHFTbnbhzdZXB1SNw-BqcyGdXkC4dUJuZOT3XQn3s-mAHQaJ9GCA0R4Twp_jBGNCzO37azvoIQPqqXgVdJwPbm3Fh5uhBzB_wr4AlwjtgqGCp1r_wEF2zNymj5aw=w1588-h893-no?authuser=0";

const UserProfile = () => {
  const { profileUserName } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [profile, setProfile] = useState({});
  const profileID = getLoggedInProfileID();
  const { url: userProfileRoute } = useRouteMatch();

  const [userProfileImage, setUserProfileImage] = useState(null);
  const [profileImageStatus, setProfileImageStatus] = useState("idle");
  const [userCoverImage, setUserCoverImage] = useState(null);
  const [coverImageStatus, setCoverImageStatus] = useState("idle");

  const [status, setStatus] = useState("idle");

  const userProfileSrc = usePreviewImage(userProfileImage, placeholderImageSrc);
  const userCoverSrc = usePreviewImage(userCoverImage, placeholderImageSrc);

  const [showEditModal, setShowEditModal] = useState(false);

  const isAuthorisedUser = () => {
    return profileID === profile.profileID;
  };

  useEffect(() => {
    setStatus("loading");
    const drafts = axios.get(
      `${baseURL}/profile/getBlogsAndProfile/0/${profileUserName}/DRAFTS`
    );
    const notDrafts = axios.get(
      `${baseURL}/profile/getBlogsAndProfile/0/${profileUserName}/NON_DRAFTS`
    );
    const blogs = axios.get(
      `${baseURL}/profile/getBlogsAndProfile/0/${profileUserName}/PUBLISHED`
    );
    const profile = getProfileDetailsAPIHandler(profileUserName);

    Promise.all([drafts, notDrafts, blogs, profile])
      .then(([resDrafts, resNotDrafts, resBlogs, resProfile]) => {
        const profileData = resProfile.profile;
        setProfile(profileData);
        setBlogs(resBlogs.data.blogs);
        setDrafts([...resDrafts.data.blogs, ...resNotDrafts.data.blogs]);

        setUserProfileImage(profileData.profilePicImageURL);
        setUserCoverImage(profileData.profileBannerImageURL);
      })
      .finally(() => {
        setStatus("idle");
      });
  }, [profileUserName]);

  function handleClose() {
    setShowEditModal(false);
  }

  async function handleProfileUpload(ev, validationOptions) {
    const imageFile = ev.target.files[0];
    const inputName = ev.target.name;

    if (!(await validateImage(imageFile, validationOptions))) return;
    if (!profile.profileID) return;

    const formData = new FormData();
    formData.append(inputName, imageFile);

    try {
      const res = await updateProfileDetails(profile.profileID, formData);
      return await res.json();
      // data.
    } catch (error) {
      console.info("Failed to upload your image");
      console.error(error);
      alert("Failed to upload your image. Try again");
    }
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

  return (
    <div className={style.main}>
      <div className={style.body}>
        <div className={style.profileDetails}>
          <img
            className={clsx(
              style.coverImage,
              status === "loading--profileBannerImage" &&
                style.usersImageLoading
            )}
            src={userCoverSrc}
            alt=""
          />

          <input
            id="profileBannerImage"
            name="profileBannerImage"
            className={style.editImageInput}
            onChange={(ev) => {
              setCoverImageStatus("loading");
              handleProfileUpload(ev, { maxWidth: 2000, maxHeight: 600 })
                .then((res) => {
                  console.log("updating", { res });
                  if (res?.success === true) {
                    setUserCoverImage(ev.target.files[0]);
                  }
                })
                .finally(() => {
                  setCoverImageStatus("idle");
                });
            }}
            type="file"
            accept=".jpg,.jpeg,.png,.svg"
            disabled={coverImageStatus === "loading"}
          />
          <label
            htmlFor="profileBannerImage"
            className={clsx(
              style.editImageLabel,
              coverImageStatus === "loading" && style.editImageLabelDisabled
            )}
          >
            <EditOutlinedIcon className={style.bannerEditIcon} />
          </label>

          {coverImageStatus === "loading" && (
            <div className={style.usersImageSpinner}>
              <Spinner />
            </div>
          )}
        </div>

        {/* User Profile */}
        <section className={style.userProfile}>
          {/* User Image */}
          <div className={style.col1}>
            <img className={style.profileImage} src={userProfileSrc} alt="" />

            <input
              id="profilePicImage"
              name="profilePicImage"
              className={style.editImageInput}
              onChange={(ev) => {
                setProfileImageStatus("loading");
                handleProfileUpload(ev, {
                  onlyAspectRatio: true,
                  aspectRatio: [1, 1],
                })
                  .then((res) => {
                    if (res?.success === true) {
                      setUserProfileImage(ev.target.files[0]);
                    }
                  })
                  .finally(() => {
                    setProfileImageStatus("idle");
                  });
              }}
              type="file"
              disabled={profileImageStatus === "loading"}
              accept=".jpg,.jpeg,.png,.svg"
            />
            <label htmlFor="profilePicImage" className={style.editImageLabel}>
              <FiCamera className={style.profileEditIcon} />
            </label>

            {profileImageStatus === "loading" && (
              <div className={style.usersImageSpinner}>
                <Spinner />
              </div>
            )}
          </div>

          {/* User Details */}
          <div className={style.col2}>
            <h1>{profile.profileName}</h1>
            <div className={style.profileDes}>
              <li>{profile.profileBio}</li>
              <li></li>
              <li></li>
            </div>
            {/* <p className={style.profileDes}>Mumbai, Maharashtra</p> */}

            <div className={style.profileFollow}>
              <PeopleOutlineIcon className={style.followIcon} />
              <div className={style.follow}>
                <small>Following</small>
                {/* <h1>596</h1> */}
                <h1> {profile.FollowingCount}</h1>
              </div>
              <PeopleOutlineIcon className={style.followIcon} />
              <div className={style.follow}>
                <small>Followers</small>
                <h1>{profile.FollowersCount}</h1>
              </div>
            </div>

            <Moment>{profile?.profileTimestamp?.$date}</Moment>

            {/* Action Btns Group */}
            <div className={style.userButton}>
              {isAuthorisedUser() ? (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => setShowEditModal(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <Button variant="outlined">Follow</Button>
              )}
            </div>
          </div>

          {/* Socials */}
          <div className={style.social}>
            <h3>Social</h3>
            <ul>
              <li>
                <LinkedInIcon className={style.socialIcons} /> LinkedIn
              </li>
              <li>
                <GitHubIcon className={style.socialIcons} />
                Website
              </li>
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
          {/* {isAuthorisedUser() && (
            <div className={style.buttons}>
              <button
                className={`${style.buttons_followButton} ${style.secondaryButton}`}
              >
                Follow
              </button>
              <button
                className={style.buttons_editProfile}
                onClick={() => setShowEditModal(true)}
              >
                Edit profile
              </button>
            </div>
          )} */}
          {showEditModal && (
            // this class makes it look like page on mobile
            <Modal className={style.modal}>
              <EditProfileDetails
                profileUserName={profileUserName}
                onClose={handleClose}
              />
            </Modal>
          )}
        </div>
      </div>

      <div className={style.blogDraftWrapper}>
        {/* Blogs Draft Nav */}
        <nav>
          <NavLink
            activeClassName={style.navBtnActive}
            to={`${userProfileRoute}/blogs`}
            className={style.navBtn}
          >
            My Blogs
          </NavLink>

          <NavLink
            activeClassName={style.navBtnActive}
            to={`${userProfileRoute}/drafts`}
            className={style.navBtn}
          >
            My Drafts
          </NavLink>
        </nav>

        <Switch>
          {/* Blogs */}
          <Route path="/:profileUserName/blogs">
            <UserProfileBlogs profile={profile} />
          </Route>

          <Route path="/:profileUserName/drafts">
            <UserProfileDrafts profile={profile} />
          </Route>
          {/* Drafts */}
        </Switch>
      </div>
    </div>
  );
};

export default UserProfile;
