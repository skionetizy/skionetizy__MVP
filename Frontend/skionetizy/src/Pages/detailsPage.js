import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { checkProfileUsernameIsAvailableAPIHandler } from "../API/profileAPIHandler";
import Vector from "../Assets/bro.svg";
import useDebounceGeneral from "../hooks/useDebounceGeneral";
import style from "../Pages/detailsPage.module.css";
import { AUTH } from "../store/reducer";
import baseURL from "../utils/baseURL";

const DetailsPage = (props) => {
  const [details, setDetails] = useState({
    profileUserName: "",
    profileBio: "",
    profileGender: "",
  });
  const [message, setMessage] = useState("");
  const [usernameValidaion, setUsernameValidation] = useState("");

  // console.log({ profileUserNameBeforeUseDebounce: details.profileUserName });
  const debounceData = useDebounceGeneral(details.profileUserName, 5000); //2seconds
  const dispatch = useDispatch();
  console.log({ profileUserNameAfterUseDebounce: debounceData });
  const history = useHistory();

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
            // alert(`${res.data.message}`);
            console.log({ messageInUse: res.data.message });
            setMessage(res.data.message);
            console.log(res.data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    }
  }, [debounceData]);

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

    !validateSpaceInUsername() &&
      axios
        .post(`${baseURL}/profile/addProfileUsernameBioUserDetails/`, {
          ...newData,
        })
        .then((res) => {
          console.log("Success:", res.data);
          dispatch({ type: AUTH.SAVE_PROFILE, payload: res.data.profile });
          history.push("/");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
  };

  const validateSpaceInUsername = () => {
    if (details.profileUserName.includes(" ")) {
      setUsernameValidation("Profile Username must not have space");
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className={`${style.container} ${style.cover_details}`}>
      {console.log({ details })}
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
              <div>
                {details.profileUserName.length > 0 &&
                  validateSpaceInUsername() && <p>{usernameValidaion}</p>}
              </div>
              <div onChange={handleChange("profileGender")}>
                <label>Gender</label>
                <input type="radio" name="profileGender" value="MALE" />
                <label>Male</label>
                <input type="radio" name="profileGender" value="FEMALE" />{" "}
                <label>Female</label>
                <input type="radio" name="profileGender" value="OTHERS" />{" "}
                <label>Others</label>
              </div>
              <p>{message}</p>
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
export default connect(mapStateToProps, null)(DetailsPage);
