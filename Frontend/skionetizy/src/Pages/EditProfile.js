import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getProfileDetailsAPIHandler,
    updateProfileDetails,
} from "../API/profileAPIHandler";
import FormInput from "../Components/FormInput";
import useForm from "../hooks/useForm";
import { getLoggedInUserID } from "../utils/AuthorisationUtils";
import usePreviewImage from "../hooks/usePreviewImage";
import style from '../Pages/editProfile.module.css'
import Footer from "../Components/Footer";

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
        const formData = new FormData();
        formData.append("profileBio", data.profileBio);
        formData.append("profileWebsiteURL", data.profileWebsiteURL);

        updateProfileDetails(profile.profileID, formData);
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
        <div>
            <div class={style.container}>
                <div className={style.labelImg}>

                    <img
                        className={style.coverImage}
                        src={bannerImageSrc || profile.profileBannerImageURL}
                        alt=""
                        width="300"
                        height="300"
                    />
                    <div class={style.middle}>

                    </div>
                    {/* <input
                    // accept=".jpg,.jpeg,.png,.svg"
                    type="file"
                    id={style.files}
                    name="profileBannerImage"
                    onChange={handleImageChange}
                /> */}

                </div>

                {/* Profile image input */}
                {/* <p>Profile</p> */}
                {/* Preview Pic Image */}

                <img
                    className={style.profileImage}
                    src={picImageSrc || profile.profilePicImageURL}
                    alt=""
                    width="300"
                    height="300"
                />


                {/* <div class={style.middle1}>
                <div class={style.text}><PublishIcon fontSize="large" /></div>
            </div> */}

                {/* <input
                type="file"
                id={style.files}
                name="profilePicImage"
                onChange={handleImageChange}

            /> */}

            </div>
            <div className={style.form}>

                <form className={style.edit_form} onSubmit={handleSubmit}>
                    <div className={style.inputs}>

                        <fieldset class={style.fieldSet}>
                            <legend class={style.legendHeading}>Edit Profile</legend>

                            <label htmlFor="firstName">First Name</label>
                            <input type="text" id="firstName" name="firstName" placeholder="Enter Name.."></input>

                            <label htmlFor="middleName">Middle Name</label>
                            <input type="text" id="middleName" name="middleName" placeholder="Enter Middle Name.."></input>

                            <label htmlFor="lastName">Last Name</label>
                            <input type="text" id="lastName" name="lastName" placeholder="Enter Last Name.."></input>

                            <label htmlFor="websiteLink">Website Link</label>
                            <FormInput id="websiteLink"
                                {...getInputProps("profileWebsiteURL")}
                            />
                            <label htmlFor="Bio">Bio</label>
                            <textarea id="Bio" type="textarea" name="Bio" class={style.bioInput} placeholder="Enter your Bio..." {...getInputProps("profileBio")} > </textarea>
                        </fieldset>

                    </div>

                    <button className={style.saveButton} disabled={status === "loading"} type="submit">
                        Save
                    </button>

                </form>
                <Footer />
            </div>
        </div>
    );
}
