import axios from "axios";

import baseURL from "../utils/baseURL";

export const profileUserNameBioUserDetailsAPIHandler = (data) => {
  console.log({ dataInAPI: data });
  return axios.post(
    `${baseURL}/profile/addProfileUsernameBioUserDetails`,
    data
  );
};
