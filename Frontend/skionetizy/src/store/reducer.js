const initialState = {
  userID: "ab304cc9-1849-48f8-86a0-0ac39ff9929d",
  isLogin: false,
  blogID: "",
  firstName: "rohan",
  lastName: "devaki",
  slicedBlogs: [],
  filteredBlogs: [],
  profile: null,
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
    case "SAVE_FILTERED_BLOGS":
      const filteredBlogs = action.payload;
      console.log({ filteredBlogsInReducer: filteredBlogs });
      return {
        ...state,
        filteredBlogs,
      };

    case "SAVE_PROFILE": {
      return {
        ...state,
        profile: action.payload,
      };
    }
    default:
      return state;
  }
};

export default Reducer;
