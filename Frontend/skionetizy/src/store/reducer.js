const initialState = {
  userID: "",
  isLogin: false,
  blogID: "",
  firstName: "",
  lastName: "",
  slicedBlogs: [],
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SAVE_USER_ID":
      // console.log({ userIDFromReducer: action.userID });
      return {
        ...state,
        userID: action.userID,
        isLogin: true,
      };
    case "SAVE_BLOG_ID":
      return {
        ...state,
        blogID: action.blogID,
      };
    case "SAVE_USER_DETAILS_AFTER_SIGNUP":
      const userDetails = { ...action.payload };
      console.log({ userDetailsInReducer: userDetails });
      return {
        ...state,
        userID: userDetails.userID,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
      };
    case "SAVE_SLICED_BLOGS":
      const slicedBlogs = action.payload;
      console.log({ slicedBlogsInReducer: slicedBlogs });
      return {
        ...state,
        slicedBlogs,
      };
    default:
      return state;
  }
};

export default Reducer;
