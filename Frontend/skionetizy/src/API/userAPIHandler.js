import axios from "axios";
import baseURL from "../utils/baseURL";

export function sendFollowUser(profileID, toFollowID) {
  return axios.patch(`${baseURL}/api/profile/addFollower/${profileID}`, {
    to_follow_id: toFollowID,
  });
}

export function sendUnfollowUser(profileID, toUnfollowID) {
  return axios.patch(`${baseURL}/profile/removeFollower/${profileID}`, {
    to_remove_from_following: toUnfollowID,
  });
}

export function sendLogin(data) {

  return axios.post(`${baseURL}/login`, data).then((res) => res.data);
}
