import axios from "axios";

import baseURL from "../utils/baseURL";

import { getLoggedInUserID } from "../utils/AuthorisationUtils";

const loggedInUser = getLoggedInUserID();

export const likeOnBlogAPIHandler = (blogID) => {
  // const loggedInUser = getLoggedInUserID();
  console.log({ loggedInUser });
  axios
    .patch(`${baseURL}/blog/likeOnBlog/${loggedInUser}/${blogID}`)
    .then((res) => {
      console.log(res.data);
      // setHasliked((previousHasLiked) => !previousHasLiked);
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

export const removeLikeOnBlogAPIHandler = (blogID) => {
  axios
    .patch(`${baseURL}/blog/removeLikeOnBlog/${loggedInUser}/${blogID}`)
    .then((res) => {
      console.log(res.data);
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

export const dislikeOnBlogAPIHandler = (blogID) => {
  axios
    .patch(`${baseURL}/blog/dislikeOnBlog/${loggedInUser}/${blogID}`)
    .then((res) => {
      console.log(res.data);
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

export const removeDislikeOnBlogAPIHandler = (blogID) => {
  axios
    .patch(`${baseURL}/blog/removeDislikeOnBlog/${loggedInUser}/${blogID}`)
    .then((res) => {
      console.log(res.data);
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

// export const dislikeBlog
