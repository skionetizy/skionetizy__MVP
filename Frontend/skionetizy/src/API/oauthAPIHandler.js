import axios from "axios";
import baseURL from "../utils/baseURL";

// send full url with params returned by google apis
export const sendGoogleAuthCode = ({ callbackURL }) => {
  return axios
    .post(`/auth/authToken`, { callbackURL })
    .then((res) => res.data);
};
