const initialState = {
  userID: "ab304cc9-1849-48f8-86a0-0ac39ff9929d",
  isLogin: false,
  blogID: "",
  firstName: "testFirst",
  lastName: "testLast",
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
    default:
      return state;
  }
};

export default Reducer;
