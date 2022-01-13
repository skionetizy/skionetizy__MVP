import {
  AUTHORIZATION_HEADER,
} from "../utils/localStorageKeys";

const initialState = {
  userID: "ab304cc9-1849-48f8-86a0-0ac39ff9929d",
  isLogin: false,
  jwtToken: localStorage.getItem(AUTHORIZATION_HEADER),
  blogID: "",
  firstName: "rohan",
  lastName: "devaki",
  slicedBlogs: [],
  filteredBlogs: [],
  profile: null,
  markdownMode: "add",
};

export const AUTH = {
  SAVE_PROFILE: "SAVE_PROFILE",
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case "MARKDOWN_MODE":
      return {
        ...state,
        markdownMode: action.payload,
      };

    case "SAVE_USER_ID":
      console.log("Inside Reducer ->", { userIDFromReducer: action.userID });
      return {
        ...state,
        userID: action.userID,
        isLogin: true,
      };
    case "SAVE_JWT_TOKEN_AFTER_LOGIN":
      console.log("Inside SAVE_JWT_TOKEN_AFTER_LOGIN ->", { jwtTokenFromReducer: action.jwtToken });
      return {
        ...state,
        jwtToken: action.jwtToken,
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

    case AUTH.SAVE_PROFILE: {
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
