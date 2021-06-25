import axios from "axios";

import baseURL from "../utils/baseURL";

export const likeOnBlogAPIHandler = (blogID, loggedInUser) => {
  // const loggedInUser = getLoggedInUserID();
  console.log({ loggedInUser });
  let result;
  axios
    .patch(`${baseURL}/blog/likeOnBlog/${loggedInUser}/${blogID}`)
    .then((res) => {
      console.log(res.data);
      // setHasliked((previousHasLiked) => !previousHasLiked);
      result = true;
    })
    .catch((err) => {
      console.log(err);
      result = false;
    });
  return result;
};

export const removeLikeOnBlogAPIHandler = (blogID, loggedInUser) => {
  let result;
  axios
    .patch(`${baseURL}/blog/removeLikeOnBlog/${loggedInUser}/${blogID}`)
    .then((res) => {
      console.log(res.data);
      result = true;
    })
    .catch((err) => {
      console.log(err);
      result = false;
    });
  return result;
};

export const dislikeOnBlogAPIHandler = (blogID, loggedInUser) => {
  let result;
  axios
    .patch(`${baseURL}/blog/dislikeOnBlog/${loggedInUser}/${blogID}`)
    .then((res) => {
      console.log(res.data);
      result = true;
    })
    .catch((err) => {
      console.log(err);
      result = false;
    });
  return result;
};

export const removeDislikeOnBlogAPIHandler = (blogID, loggedInUser) => {
  let result;
  axios
    .patch(`${baseURL}/blog/removeDislikeOnBlog/${loggedInUser}/${blogID}`)
    .then((res) => {
      console.log(res.data);
      result = true;
    })
    .catch((err) => {
      console.log(err);
      result = false;
    });
  return result;
};

// export const dislikeBlog
