import axios from "axios";

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

export const getAllBlogsByUserAPIHandler = (userID) =>{
  return axios
  .get(`${baseURL}/blog/getBlogsByUser/${userID}`)
  .then((res)=>{
    console.log({ blogDataAPIHandler: res.data });
      return res.data;
  })
  .catch((err) => console.log(err));
}