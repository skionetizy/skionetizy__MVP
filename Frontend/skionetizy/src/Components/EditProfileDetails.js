import React, { useEffect, useState } from "react";
import useForm from "../hooks/useForm";
import clsx from "../utils/clsx";
import style from "./EditProfileDetails.module.css";
import * as yup from "yup";
import axios from "axios";
import baseURL from "../utils/baseURL";
import {
  getProfileDetailsAPIHandler,
  updateProfileDetails,
} from "../API/profileAPIHandler";
import getYupErrors from "../utils/getYupErrors";
import Spinner from "./Spinner";
import { FiLoader, FiArrowLeft } from "react-icons/fi";

const initailData = {
  profileBio: "",
  profileWebsiteURL: "",
};

const editProfileSchema = yup.object().shape(
  {
    profileWebsiteURL: yup
      .string()
      .url("Website URL must be valid URL")
      .when("profileWebsiteURL", {
        is: (url) => !!url,
        then: yup.string().min(7, "Website URL must be 7 characters longer"),
      }),
    profileBio: yup.string().when("profileBio", {
      is: (bio) => !!bio,
      then: yup.string().min(3, "Bio must be 3 characters longer"),
    }),
  },
  [
    ["profileWebsiteURL", "profileWebsiteURL"],
    ["profileBio", "profileBio"],
  ]
);

function EditProfileDetails({ onClose, profileUserName }) {
  const [status, setStatus] = useState("idle");
  const { data, setData, getInputProps, setErrors, errors } =
    useForm(initailData);
  const [profile, setProfile] = useState({});

  const isLoading = status === "loading";
  const isProfileLoading = status === "fetching-profile";

  useEffect(() => {
    setStatus("fetching-profile");
    getProfileDetailsAPIHandler(profileUserName).then((res) => {
      setProfile(res.profile);
      setData(res.profile);
      setStatus("idle");
    });
  }, [profileUserName, setData]);

  async function handleSubmit(ev) {
    try {
      ev.preventDefault();
      // validate data

      setErrors({});
      const validData = await editProfileSchema.validate(data, {
        abortEarly: false,
        context: true,
      });

      //change to getlogginedProfileID
      setStatus("loading");
      const formData = new FormData();
      formData.append("profileBio", validData.profileBio);
      formData.append("profileWebsiteURL", validData.profileWebsiteURL);
      await updateProfileDetails(profile.profileID, formData);
      setStatus("success");
      onClose();
    } catch (error) {
      console.log("in catch block", error);
      if (error instanceof yup.ValidationError) {
        setErrors(getYupErrors(error));
      } else if (error.isAxiosError) {
        setErrors((prev) => ({
          ...prev,
          axiosError: error.response?.data.message || "Server Error",
        }));
      } else {
        console.error(error);
        throw error;
      }
    }
  }
  return (
    <div className={style.wrapper}>
      {isProfileLoading && (
        <div className={style.backdrop}>
          <FiLoader width="1em" fontSize="2rem" className="ani-spinner" />
        </div>
      )}
      <button className={style.closeBtn} onClick={onClose}>
        &times;
      </button>

      <button className={style.backBtn} onClick={onClose}>
        <FiArrowLeft width="1em" />
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
              disabled
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
            <InputError error={errors.profileWebsiteURL} />

            <div className={style.bio}>
              <label htmlFor="Bio">Bio</label>
              <textarea id="Bio" {...getInputProps("profileBio")} rows="4" />
            </div>
            <InputError error={errors.profileBio} />
          </div>
        </div>
        <button type="submit" className={style.savebtn} disabled={isLoading}>
          {isLoading && <Spinner />} Save
        </button>
      </form>
    </div>
  );
}

function InputError({ className, error, ...props }) {
  return error ? (
    <p className={clsx(style.inputError, className)} {...props}>
      {error}
    </p>
  ) : null;
}

export default EditProfileDetails;
