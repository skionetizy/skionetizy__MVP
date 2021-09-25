import React from "react";
import { FaDoorOpen, FaEdit, FaNewspaper, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import DefaultUserAvatar from "../Assets/avtar.png";
import useAuth from "../hooks/useAuth";
import Dropdown from "./Dropdown";
import styles from "./Profiledropdown.module.css";

export default function ProfileDropdown() {
  const { isLoggedIn, profile, logout } = useAuth();
  const profileUserName = profile?.profileUserName;

  return isLoggedIn === false ? (
    <img
      src={DefaultUserAvatar}
      style={{
        width: "2rem",
        height: "2rem",
        objectFit: "cover",
        borderRadius: "999px",
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
  );
}
