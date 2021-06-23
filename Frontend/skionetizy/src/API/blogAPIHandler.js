import axios from "axios";

import baseURL from "../utils/baseURL";

export const likeOnBlogAPIHandler = (blogID, loggedInUser) => {
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

export const removeLikeOnBlogAPIHandler = (blogID, loggedInUser) => {
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

export const dislikeOnBlogAPIHandler = (blogID, loggedInUser) => {
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

export const removeDislikeOnBlogAPIHandler = (blogID, loggedInUser) => {
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
