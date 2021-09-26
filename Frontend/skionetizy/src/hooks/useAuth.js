import React, { useEffect, useReducer, useState } from "react";
import { sendLogin } from "../API/userAPIHandler";
import {
  getHoverProfileDetails,
  getProfileDetailsAPIHandler,
} from "../API/profileAPIHandler";
import { useDispatch, useSelector } from "react-redux";
import { AUTH } from "../store/reducer";
import {
  AUTHORIZATION_HEADER,
  LOGGED_IN_PROFILE_ID,
} from "../utils/localStorageKeys";
import axios from "axios";

function useAuth() {
  const dispatch = useDispatch();
  const profile = useSelector((store) => store.profile);
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(AUTHORIZATION_HEADER) || "";
    } catch {
      localStorage.removeItem(AUTHORIZATION_HEADER);
      return "";
    }
  });

  async function login({ emailID, password }) {
    const res = await sendLogin({ emailID, password });
    const { profileID, token } = res;

    axios.defaults.headers["Authorization"] = token;
    setToken(token);
    localStorage.setItem(AUTHORIZATION_HEADER, token);
    localStorage.setItem(LOGGED_IN_PROFILE_ID, profileID);
    saveProfile(profileID);

    return res;
  }

  function logout() {
    setToken("");
    localStorage.setItem(LOGGED_IN_PROFILE_ID, "");
    localStorage.removeItem(AUTHORIZATION_HEADER, "");
    delete axios.defaults.headers["Authorization"];

    dispatch({
      type: AUTH.SAVE_PROFILE,
      payload: null,
    });
  }

  async function saveProfile(profileID) {
    const { profileUserName } = await getHoverProfileDetails(profileID);
    const profile = await getProfileDetailsAPIHandler(profileUserName).then(
      (r) => r.profile
    );

    dispatch({
      type: AUTH.SAVE_PROFILE,
      payload: profile,
    });
    return profile;
  }

  useEffect(() => {
    let profileID;
    try {
      profileID = localStorage.getItem("profileID");
    } catch {
      profileID = null;
    }

    if (profileID) saveProfile(profileID);
  }, []);

  return { profile, login, logout, isLoggedIn: !!profile, token };
}

export default useAuth;
