import React, { useEffect } from "react";
import axios from "axios";
import { FaDoorOpen, FaEdit, FaNewspaper, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import DefaultUserAvatar from "../Assets/avtar.png";
import Dropdown from "./Dropdown";
import styles from "./Profiledropdown.module.css";
import { GoogleLogout } from "react-google-login";
import { connect } from "react-redux";
import {
    AUTHORIZATION_HEADER,
    LOGGED_IN_PROFILE_ID,
} from "../utils/localStorageKeys";


function ProfileDropdown(props, { className }) {
    const profile=props.profile;
    
    console.log("Inside ProfileDropdown->", profile);
    console.log("Logged in ? ",props.isLoginRedux)
    const profileUserName = profile?.profileUserName;
    //console.log("pp", isLoggedIn, profile);
    const logout=()=>{
        localStorage.setItem(LOGGED_IN_PROFILE_ID, "");
        localStorage.removeItem(LOGGED_IN_PROFILE_ID, "");
        localStorage.setItem(AUTHORIZATION_HEADER, "");
        localStorage.removeItem(AUTHORIZATION_HEADER, "");
        delete axios.defaults.headers["Authorization"];
        props.onlogout();
    }
    return ((props.isLoginRedux === false) ? (
        <img
            className={className}
            src={DefaultUserAvatar}
            style={{
                width: "3rem",
                height: "3rem",
                objectFit: "cover",
                borderRadius: "50%",
                // margin: "0.1rem"
            }}
            alt="Default User Pic"
        />
    ) : (
        <Dropdown>
            <Dropdown.Button>
                <img
                    src={profile?.profilePicImageURL || "#"}
                    style={{
                        width: "2rem",
                        height: "2rem",
                        objectFit: "cover",
                        borderRadius: "999px",
                    }}
                    alt="user profile"
                />
            </Dropdown.Button>

            <Dropdown.Body align="right">
                <div className={styles.wrapper}>
                    <div className={styles.details}>
                        <img
                            className={styles.profileImage}
                            src={profile?.profilePicImageURL || "#"}
                            alt="user profile"
                        />
                        <p className={styles.profileName}>{profile?.profileName}</p>
                        <p className={styles.email}>{profile?.emailID}</p>
                    </div>

                    <div className={styles.linksWrapper}>
                        <ul className={styles.links}>
                            <li>
                                <FaDoorOpen width="1em" />{" "}
                                <Link variant="link" onClick={() => logout()} to={`/`}>
                                    Logout
                                </Link>
                            </li>
                            <li>
                                <FaUser width="1em" />{" "}
                                <Link to={`/${profileUserName}`}>View Profile</Link>
                            </li>
                            <li>
                                <FaNewspaper width="1em" />{" "}
                                <Link to={`/${profileUserName}`}>My Blogs</Link>
                            </li>
                            <li>
                                <FaEdit width="1em" />{" "}
                                <Link to={`/${profileUserName}`}>Edit Profile</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </Dropdown.Body>
        </Dropdown>
    ));
}


const mapStateToProps = (state) => {
  return {
    isLoginRedux : state.isLogin,
    profile: state.profile,
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
      onlogout : ()=> dispatch({ type: "LOGOUT" })
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDropdown);