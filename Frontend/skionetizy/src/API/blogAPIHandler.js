import axios from "axios";
import {
  getLoggedInProfileID,
  getLoggedInUserID,
} from "../utils/AuthorisationUtils";

import baseURL from "../utils/baseURL";

export const likeOnBlogAPIHandler = (blogID, loggedInUser) => {
  // const loggedInUser = getLoggedInUserID();
  console.log({ loggedInUser });
  return axios
    .patch(`${baseURL}/blog/likeOnBlog/${loggedInUser}/${blogID}`)
    .then((res) => {
      console.log(res.data);
      // setHasliked((previousHasLiked) => !previousHasLiked);
      // return res.data.success;
      return res.data;
    })
    .catch((res) => {
      console.log(res);
      return res;
    });
};

export const removeLikeOnBlogAPIHandler = (blogID, loggedInUser) => {
  return axios
    .patch(`${baseURL}/blog/removeLikeOnBlog/${loggedInUser}/${blogID}`)
    .then((res) => {
      console.log(res.data);
      // return res.data.success;
      return res.data;
    })
    .catch((res) => {
      console.log(res);
      return res;
    });
};

export const dislikeOnBlogAPIHandler = (blogID, loggedInUser) => {
  return axios
    .patch(`${baseURL}/blog/dislikeOnBlog/${loggedInUser}/${blogID}`)
    .then((res) => {
      console.log(res.data);
      // console.log({result});
      // return res.data.success;
      return res.data;
    })
    .catch((res) => {
      console.log(res);
      return res;
    });
};

export const removeDislikeOnBlogAPIHandler = (blogID, loggedInUser) => {
  return axios
    .patch(`${baseURL}/blog/removeDislikeOnBlog/${loggedInUser}/${blogID}`)
    .then((res) => {
      console.log(res.data);
      // return res.data.success;
      return res.data;
    })
    .catch((res) => {
      console.log(res);
      return res;
    });
};

export const getBlogAPIHandler = (blogID) => {
  return axios
    .get(`${baseURL}/blog/getBlogByBlogID/${blogID}`)
    .then((res) => {
      console.log({ blogDataAPIHandler: res.data });
      return res.data;
    })
    .catch((err) => console.log(err));
};

export const getAllBlogsByProfileAPIHandler = (profileUserName) => {
  return axios
    .get(`${baseURL}/blog/getBlogsByProfile/${profileUserName}`)
    .then((res) => {
      console.log({ blogDataAPIHandler: res.data });
      return res.data;
    })
    .catch((err) => console.log(err));
};

export const deleteCommentAPIHandler = ({ comment, blogID }) => {
  const userID = getLoggedInUserID();
  console.log({ comment, blogID, userID });
  return axios.patch(`${baseURL}/blog/removeCommentOnBlog`, {
    commentID: comment.commentID,
    userID: userID,
    blogID: blogID,
  });
};

export const addCommentAPIHandler = ({
  profileID,
  commentDescription,
  blogID,
}) => {
  return axios.patch(`/blog/addCommentToBlog`, {
    commentDescription,
    blogID,
    profileID,
  });
};

export const getBlogsAndProfileDetails = () =>
  axios.get(`${baseURL}/blog/getBlogsAndProfileDetails`).then((r) => r.data);

export const addViewApiHandler = (blogID) => {
  return axios.patch(`/api/blog/addView/${blogID}`);
};

export const addFollower = (profileID) => {
  return axios.patch(`/api/profile/addFollower/${profileID}`);
};
export const removeFollower = (profileID) => {
  return axios.patch(`/api/profile/removeFollower/${profileID}`);
};

export const getKeywords = (keywordPrediction) => {
  return axios.get(`${baseURL}/blog/getKeywords/${keywordPrediction}`);
};

export const getKeywordsByAI = ({ blogDescription }) => {
  return axios.post(`${baseURL}/ai/keywords`, { input: blogDescription });
};

export const addKeywords = (data) => {
  return axios.post(`${baseURL}/blog/addMeta`, data);
};

export const getFeedBlogs = ({ profileID, page }) => {
  return axios.get(`${baseURL}/api/blog/getFeed/${profileID}/${page}`);
};
