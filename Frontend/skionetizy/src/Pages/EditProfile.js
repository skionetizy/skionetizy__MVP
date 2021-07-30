import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getProfileDetailsAPIHandler,
  updateProfileDetails,
} from "../API/profileAPIHandler";
import FormInput from "../Components/FormInput";
import useForm from "../hooks/useForm";

const initailData = {
  profileBio: "",
  profileWebsiteURL: "",
  profilePicImage: null,
  rofileBannerImage: null,
};

export default function EditProfile() {
  const { data, getInputProps, handleChange, setData } = useForm(initailData);
  const [status, setStatus] = useState("idle");
  const { profileUserName } = useParams();

  function handleSubmit(ev) {
    ev.preventDefault();
    setStatus("loading");
    updateProfileDetails(data.profileID, data);
    setStatus("success");
  }

  useEffect(() => {
    getProfileDetailsAPIHandler(profileUserName).then((response) => {
      setData(response.profile);
    });
  }, [profileUserName, setData]);

  return (
    // remove this style tag
    <div style={{ color: "white" }}>
      <form onSubmit={handleSubmit}>
        {/* Banner image */}
        {/* onChange & name is coming from getInputProps */}
        <p>Banner</p>
        <input type="file" name="profilePicImage" onChange={handleChange} />
        {/* Profile image */}
        <p>Profile</p>
        <input type="file" name="profilePicImage" onChange={handleChange} />

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
