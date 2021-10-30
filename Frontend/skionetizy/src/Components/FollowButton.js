import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getProfileDetailsAPIHandler } from "../API/profileAPIHandler";
import { sendFollowUser, sendUnfollowUser } from "../API/userAPIHandler";
import useAuth from "../hooks/useAuth";
import clsx from "../utils/clsx";
import Button from "./Button";
import styles from "./FollowButton.module.css";

function saveProfile(dispatch, profile) {}

export default function FollowButton({
  othersProfileID,
  className,
  onClick,
  onUpdate,
  ...props
}) {
  const [status, setStatus] = useState("idle");
  const { profile } = useAuth();
  const dispatch = useDispatch();
  const history = useHistory();

  const isFollowing = profile?.Following?.includes(othersProfileID);
  const isLoading = status === "loading";
  const loggedProfileID = profile?.profileID;
  const loggedProfileUserName = profile?.profileUserName;
  const isProfileLoading = loggedProfileUserName && profile == null;

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

        dispatch({
          type: "SAVE_PROFILE",
          payload: {
            ...profile,
            Followers: res.data.profile.Followers,
            FollowersCount: res.data.profile.FollowersCount,
            Following: res.data.profile.Following,
            FollowingCount: res.data.profile.FollowingCount,
          },
        });

        onUpdate?.({
          Followers: res.data.profile.Followers,
          FollowersCount: res.data.profile.FollowersCount,
          Following: res.data.profile.Following,
          FollowingCount: res.data.profile.FollowingCount,
          isFollowing,
        });
      })
      .catch((err) => onUpdate?.(null, err));
  }

  return (
    <Button
      // className={clsx(styles.button, styles.followButton)}
      variant="primary"
      onClick={(ev) => {
        onClick?.(ev);
        if (!ev.defaultPrevented) {
          handleFollow();
        }
      }}
      disabled={isLoading || isProfileLoading}
      {...props}
    >
      {isProfileLoading
        ? "Loading..."
        : isFollowing
        ? "Subscribed"
        : "Subscribe"}
    </Button>
  );
}
