import React, { useState, useEffect } from "react";
import styles from "./Profiledropdown.module.css";
import Dropdown from "./Dropdown";
import { Link } from "react-router-dom";
import { FaUser, FaNewspaper, FaEdit } from "react-icons/fa";
import { getProfileDetailsAPIHandler } from "../API/profileAPIHandler";

const profileUserName = "test1";
export default function ProfileDropdown() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfileDetailsAPIHandler(profileUserName).then((res) => {
      setProfile(res.profile);
    });
  }, []);

  return (
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
