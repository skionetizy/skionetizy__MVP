import React, { useEffect, useReducer, useState } from "react";
import { sendLogin } from "../API/userAPIHandler";
import {
  getHoverProfileDetails,
  getProfileDetailsAPIHandler,
} from "../API/profileAPIHandler";
import { useDispatch, useSelector } from "react-redux";
import { AUTH } from "../store/reducer";
import { AUTHORIZATION_HEADER } from "../utils/localStorageKeys";

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

  async function login({ email, password }) {
    const res = await sendLogin({ email, password });
    const { profileID, token } = res;

    setToken(token);
    localStorage.setItem(AUTHORIZATION_HEADER, token);
    saveProfile(profileID);

    return res;
  }

  function logout() {
    setToken("");
    localStorage.removeItem(AUTHORIZATION_HEADER);

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
      profileID = JSON.parse(localStorage.getItem("profileID"));
    } catch {
      profileID = null;
    }

    if (profileID) saveProfile(profileID);
  }, []);

  return { profile, login, logout, isLoggedIn: !!profile, token };
}

export default useAuth;
