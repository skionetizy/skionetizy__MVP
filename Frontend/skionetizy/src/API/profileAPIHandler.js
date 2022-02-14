import axios from "axios";

import baseURL from "../utils/baseURL";

export const addProfileUsernameBioUserDetailsAPIHandler = (data) => {
  console.log({ dataInAPI: data });
  return axios.post(`${baseURL}/profile/addProfileUsernameBioUserDetails/`, {
    ...data,
  });
};

export const updatePassword=async(data)=>{
  return await axios.post(`${baseURL}/api/forgotPassword`,{
    ...data
  })
}

export const updatePasswordToken=async(data, token)=>{
  return await axios.patch(`${baseURL}/api/forgotPassword/${token}`,{
    ...data
  })
}

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

export const updateProfileDetails = (profileID, formData) => {
  return fetch(`${baseURL}/profile/updateBlogDescriptionAndText/${profileID}`, {
    method: "PATCH",
    body: formData,
  });
};

export const getHoverProfileDetails = (profileID) => {
  // console.log("Inside getHoverProfileDetails ->", profileID)
  return axios
    .get(`/profile/getHover/${profileID}`)
    .then((r) => r.data.details);
};
