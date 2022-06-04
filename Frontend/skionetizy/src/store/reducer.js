import {
  AUTHORIZATION_HEADER,
} from "../utils/localStorageKeys";

const initialState = {
  userID: "",
  isLogin: false,
  jwtToken: "",
  blogID: "",
  firstName: "",
  lastName: "",
  slicedBlogs: [],
  filteredBlogs: [],
  profile: null,
  markdownMode: "add",
};

export const AUTH = {
  SAVE_PROFILE: "SAVE_PROFILE",
};

const Reducer = (state = initialState, action) => {
  if(localStorage.getItem(AUTHORIZATION_HEADER)!==null || !(initialState.profile === null || initialState.profile.profileID === undefined || initialState.profile.profileID === "undefined")){
    initialState.isLogin=true;
  }
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
    case "SAVE_JWT_PROFILE_AFTER_LOGIN":
      return {
        ...state,
        jwtToken: action.jwtToken,
        profile: action.profile,
        isLogin: true,
        userID: action.userID
      };
    case "SAVE_BLOG_ID":
      return {
        ...state,
        blogID: action.blogID,
      };
    // case "SAVE_USER_DETAILS_AFTER_SIGNUP":
    //   const userDetails = { ...action.payload };
    //   console.log("Inside SAVE_USER_DETAILS_AFTER_SIGNUP: ", { userDetailsInReducer: userDetails });
    //   return {
    //     ...state,
    //     userID: userDetails.userID,
    //     firstName: userDetails.firstName,
    //     lastName: userDetails.lastName,
    //   };
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
        jwtToken: action.jwtToken,
        isLogin: true
      };
    }

    case "LOGOUT": {
      localStorage.removeItem("CURRENT_NEW_ADD_BLOG");
      localStorage.removeItem("content");
      localStorage.removeItem("CURRENT_EDITING_BLOG");
      localStorage.removeItem("/");
      return {
        ...state,
        profile: null,
        jwtToken: null,
        isLogin: false,
      };
    }

    default:
      return state;
  }
};

export default Reducer;
