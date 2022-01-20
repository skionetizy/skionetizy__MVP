import axios from "axios";
import baseURL from "../utils/baseURL";

// send full url with params returned by google apis
/* export const sendGoogleAuthCode = ({ callbackURL }) => {
  return axios
    .post(`/auth/authToken`, { callbackURL })
    .then((res) => res.data);
}; */


export const sendGoogleLoginResp = async (body) => {
  const res = await axios
    .post(`/auth/googleLoginResp`, body);
  return res.data;
};