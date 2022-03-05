import axios from "axios";
import baseURL from "../utils/baseURL";

export const PostOnContactAPIHandler = (data) => {
    var flag = true;
    axios.post(`${baseURL}/contact`, data)
    .then((res) => {
      console.log(res.data);
      console.log(res.status);
    })
    .catch((err) => {
      console.log(err);
      flag = false;
    });
    return flag;
};