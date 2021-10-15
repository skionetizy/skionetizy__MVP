import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendGoogleAuthCode } from "../API/oauthAPIHandler";
import {
  getHoverProfileDetails,
  getProfileDetailsAPIHandler,
} from "../API/profileAPIHandler";
import { sendLogin } from "../API/userAPIHandler";
import { AUTH } from "../store/reducer";
import {
  AUTHORIZATION_HEADER,
  LOGGED_IN_PROFILE_ID,
} from "../utils/localStorageKeys";

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

  async function googleOAuth(body) {
    const res = await sendGoogleAuthCode(body);
    const { profile, token } = res;

    axios.defaults.headers["Authorization"] = token;
    setToken(token);
    localStorage.setItem(AUTHORIZATION_HEADER, token);
    localStorage.setItem(LOGGED_IN_PROFILE_ID, profile.profileID);

    dispatch({
      type: AUTH.SAVE_PROFILE,
      payload: profile,
    });

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
    dispatch({
      type: AUTH.SAVE_PROFILE,
      payload: { profileID },
    });

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

  return {
    profile,
    login,
    saveProfile,
    logout,
    isLoggedIn: !!profile,
    token,
    googleOAuth,
  };
}

export default useAuth;
