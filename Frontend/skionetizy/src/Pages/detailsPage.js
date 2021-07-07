import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import style from "../Pages/detailsPage.module.css";
import Vector from "../Assets/bro.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";

import {
  checkProfileUsernameIsAvailableAPIHandler,
  addProfileUsernameBioUserDetailsAPIHandler,
} from "../API/profileAPIHandler";
import baseURL from "../utils/baseURL";
import useDebounceGeneral from "../hooks/useDebounceGeneral";

const DetailsPage = (props) => {
  const [details, setDetails] = useState({
    profileUserName: "",
    profileBio: "",
  });
  console.log({ profileUserNameBeforeUseDebounce: details.profileUserName });
  const debounceData = useDebounceGeneral(details.profileUserName, 5000); //2seconds

  useEffect(() => {
    console.log("entered debounce useEffect");
    console.log({ debounceDataOutUseEffect: debounceData });
    if (debounceData) {
      console.log({ debouncedDataInUseEffect: debounceData });

      if (debounceData.length >= 15) {
        alert("profile Username must be less than 15 characters");
      } else {
        checkProfileUsernameIsAvailableAPIHandler(debounceData)
          .then((res) => {
            alert(`${res.data.message}`);
            console.log(res.data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    }
  }, [details.profileUserName]);

  const handleChange = (name) => (e) => {
    setDetails({
      ...details,
      [name]: e.target.value,
    });
    // console.log({ details });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ details });
    const newData = {
      ...details,
      userID: props.userID,
      firstName: props.firstName,
      lastName: props.lastName,
    };
    console.log({ newDataInDetails: newData });

    axios
      .post(`${baseURL}/profile/addProfileUsernameBioUserDetails/`, {
        ...newData,
      })
      .then((res) => {
        console.log("Success:", res.data);
        <Redirect to="/login" />;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className={`${style.container} ${style.cover_details}`}>
      <div className={style.coverImage_login}>
        <img src={Vector} alt="" className={style.coverImage_svgLogin} />
      </div>
      <div className={`${style.container} ${style.details}`}>
        <div className={style.header}>
          <h1 className={style.header_heading}>Details</h1>
        </div>
        <div className={style.details_container}>
          <form className={style.details_form} onSubmit={handleSubmit}>
            <div className={style.username_bio}>
              <input
                type="name"
                name="username"
                placeholder="Enter your username"
                onChange={handleChange("profileUserName")}
                //value={username}
                className={style.username}
                required
                value={details.profileUserName}
              />
              <textarea
                type="textarea"
                name="bio"
                placeholder="Enter your bio"
                onChange={handleChange("profileBio")}
                //value={bio}
                className={style.bio}
                required
                value={details.profileBio}
              />
            </div>
            <div className={style.details_text}>
              <p>Maximum length - 300 characters only</p>
            </div>
            <button className={style.nextButton} type="submit">
              Next
              <FontAwesomeIcon icon={faSignInAlt} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userID: state.userID,
    firstName: state.firstName,
    lastName: state.lastName,
  };
};
export default connect(mapStateToProps)(DetailsPage);
