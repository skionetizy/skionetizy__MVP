import axios from "axios";

import baseURL from "../utils/baseURL";

export const addProfileUsernameBioUserDetailsAPIHandler = (data) => {
  console.log({ dataInAPI: data });
  return axios.post(`${baseURL}/profile/addProfileUsernameBioUserDetails/`, {
    ...data,
  });
};

export const getProfileDetailsAPIHandler = (profileUserName) => {
  console.log({ profileIDinAPI: profileUserName });
  return axios
    .get(`${baseURL}/profile/getProfileDetails/${profileUserName}`)
    .then((res) => {
      console.log({ profileDetailsInAPIHandler: res.data });
      return res.data;
    })
    .catch((err) => console.log(err));
};

export const checkProfileUsernameIsAvailableAPIHandler = (data) => {
  console.log({ profileUserNameInAPIHandler: data });
  return axios.post(`${baseURL}/profile/checkProfileUsernameIsAvailable`, {
    profileUserName: data,
  });
};
