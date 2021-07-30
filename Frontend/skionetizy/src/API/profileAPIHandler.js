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

export const updateProfileDetails = (
  profileID,
  { userID, profileBio, profileWebsiteURL, profilePicImage, profileBannerImage }
) => {
  console.dir(
    {
      userID,
      profileBio,
      profileWebsiteURL,
      profilePicImage,
      profileBannerImage,
    },
    { depth: Infinity }
  );
  const formData = new FormData();
  formData.append("userID", userID);
  formData.append("profileBio", profileBio);
  formData.append("profileWebsiteURL", profileWebsiteURL);
  formData.append("profilePicImage", profilePicImage);
  formData.append("profileBannerImage", profileBannerImage);
  console.log({ formData });
  return fetch(
    `http://127.0.0.1:5000/profile/updateBlogDescriptionAndText/${profileID}`,
    {
      method: "PATCH",
      body: formData,
    }
  );
};
