import axios from "axios";
import React, { useEffect, useState } from "react";
import style from '../Pages/editProfile.module.css'
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



        <form className={style.edit_form} onSubmit={handleSubmit}>
            {/* Banner image */}
            {/* onChange & name is coming from getInputProps */}

            <div className={style.banner}>
                <label>

                    <input type="file" name="profilePicImage" onChange={handleChange} />
                    <img
                        className={style.coverImg}
                        src="//unsplash.it/700/700"
                        alt=""
                    />

                </label>

            </div>
            {/* Profile image */}
            <div class={style.profileImg}>
                <label>
                    

                    <img
                        src="//unsplash.it/120/120"
                        alt=""
                    />
                    <input type="file" name="profilePicImage" onChange={handleChange} />
                </label>
                </div>
            <div className={style.bio}>
                <label>Bio</label>
                <textarea className=""  {...getInputProps("profileBio")} />
            </div>
            <FormInput
                className=""
                label="Website URL"
                {...getInputProps("profileWebsiteURL")}
            />

            <button className={style.saveButton} disabled={status === "loading"} type="submit">
                Save
            </button>
        </form>


    );
}
