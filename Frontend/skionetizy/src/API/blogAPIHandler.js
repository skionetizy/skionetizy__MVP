import baseURL from "../utils/baseURL";

const loggedInUser = getLoggedInUserID();

export const likeBlog = (blogID) => {
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
