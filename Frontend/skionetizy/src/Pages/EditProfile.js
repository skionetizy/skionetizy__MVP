import axios from "axios";
import React, { useEffect, useState } from "react";
import style from "../Pages/editProfile.module.css";
import { useParams } from "react-router-dom";
import {
  getProfileDetailsAPIHandler,
  updateProfileDetails,
} from "../API/profileAPIHandler";
import FormInput from "../Components/FormInput";
import useForm from "../hooks/useForm";
import { getLoggedInUserID } from "../utils/AuthorisationUtils";
import usePreviewImage from "../hooks/usePreviewImage";

const initailData = {
  profileBio: "",
  profileWebsiteURL: "",
  profilePicImage: null,
  rofileBannerImage: null,
};

function validateImage(file, { maxWidth = 1920, maxHeight = 1080 } = {}) {
  // const img = new Image();
  // img.src = window.URL.createObjectURL(file);
  const maxFileSize = 1024 * 1024; //1mb
  // img.onload = () => {
  const ext = [".jpg", ".jpeg", ".png", ".svg"];
  const filename = file.name;

  if (file.type.match("image.*") && file.size > maxFileSize) {
    alert(
      "The selected image file is too big. Please choose one that is smaller than 1 MB."
    );
  } else if (!ext.some((el) => filename.endsWith(el))) {
    alert("only upload images of .jpg,.jpeg,.png,.svg");
  } else {
    return true;
  }
  // };
}

export default function EditProfile() {
  const { data, getInputProps, handleChange, setData } = useForm(initailData);
  const [status, setStatus] = useState("idle");
  const [profile, setProfile] = useState({});
  const { profileUserName } = useParams();
  const bannerImageSrc = usePreviewImage(data.profileBannerImage);
  const picImageSrc = usePreviewImage(data.profilePicImage);

  function handleSubmit(ev) {
    ev.preventDefault();
    const userID = getLoggedInUserID();
    setStatus("loading");
    updateProfileDetails(profile.profileID, { userID, ...data });
    setStatus("success");
  }

  function handleImageChange(ev) {
    // run validation
    if (validateImage(ev.target.files[0])) handleChange(ev);
  }

  useEffect(() => {
    setStatus("loading");
    getProfileDetailsAPIHandler(profileUserName).then((response) => {
      setData({
        profileBio: response.profile.profileBio,
        profileWebsiteURL: response.profile.profileWebsiteURL,
      });
      setProfile(response.profile);
      setStatus("idle");
    });
  }, [profileUserName, setData]);

  return (
    // remove this style tag
    <div style={{ color: "white" }}>
      <form onSubmit={handleSubmit}>
        {/* Banner image input */}
        <p>Banner</p>
        <input
          // accept=".jpg,.jpeg,.png,.svg"
          type="file"
          name="profileBannerImage"
          onChange={handleImageChange}
        />
        {/* Preview Banner Image */}
        <img
          src={bannerImageSrc || profile.profileBannerImageURL}
          alt=""
          width="300"
          height="300"
        />

        {/* Profile image input */}
        <p>Profile</p>
        <input
          type="file"
          name="profilePicImage"
          onChange={handleImageChange}
        />
        {/* Preview Pic Image */}
        <img
          src={picImageSrc || profile.profilePicImageURL}
          alt=""
          width="300"
          height="300"
        />

        {/* onChange & name is coming from getInputProps */}
        <FormInput className="" label="Bio" {...getInputProps("profileBio")} />

        <FormInput
          className=""
          label="Website URL"
          {...getInputProps("profileWebsiteURL")}
        />

        <button disabled={status === "loading"} type="submit">
          Save
        </button>
      </form>
    </div>
  );
}
