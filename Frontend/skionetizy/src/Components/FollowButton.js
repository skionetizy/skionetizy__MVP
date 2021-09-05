import React, { useEffect, useState } from "react";
import styles from "./FollowButton.module.css";
import clsx from "../utils/clsx";
import { useHistory } from "react-router-dom";
import { sendFollowUser, sendUnfollowUser } from "../API/userAPIHandler";
import { getProfileDetailsAPIHandler } from "../API/profileAPIHandler";
import { useDispatch, useSelector } from "react-redux";
import {
  getLoggedInProfileID,
  getLoggedInProfileUserName,
} from "../utils/AuthorisationUtils";

function saveProfile(dispatch, profile) {
  dispatch({ type: "SAVE_PROFILE", payload: profile });
}

export default function FollowButton({
  othersProfileID,
  className,
  onClick,
  onUpdate,
  ...props
}) {
  const [status, setStatus] = useState("idle");
  const profile = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const history = useHistory();

  const isFollowing = profile?.Following?.includes(othersProfileID);
  const isLoading = status === "loading";
  const loggedProfileID = getLoggedInProfileID();
  const loggedProfileUserName = getLoggedInProfileUserName();
  const isProfileLoading = loggedProfileUserName && profile == null;

  useEffect(() => {
    if (profile == null && loggedProfileUserName) {
      getProfileDetailsAPIHandler(loggedProfileUserName).then((data) =>
        saveProfile(dispatch, data.profile)
      );
    }
  }, [dispatch, profile, loggedProfileUserName]);

  async function handleFollow() {
    setStatus("loading");
    let promise;

    if (!loggedProfileUserName) {
      history.push("/login");
    }
    if (isFollowing) {
      promise = sendUnfollowUser(othersProfileID, loggedProfileID);
    } else {
      promise = sendFollowUser(loggedProfileID, othersProfileID);
    }

    promise
      .then((res) => {
        setStatus("idle");
        if (res.data.Message === "Already Following") return;

        saveProfile(dispatch, res.data.profile);
        onUpdate?.({
          Followers: res.data.profile.Followers,
          FollowersCount: res.data.profile.FollowersCount,
          Following: res.data.profile.Following,
          FollowingCount: res.data.profile.FollowingCount,
          isFollowing,
        });
      })
      .catch((err) => onUpdate(null, err));
  }

  return (
    <button
      className={clsx(styles.button, styles.followButton)}
      onClick={() => {
        onClick?.();
        handleFollow();
      }}
      disabled={isLoading || isProfileLoading}
      {...props}
    >
      {isProfileLoading ? "Loading..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
}
