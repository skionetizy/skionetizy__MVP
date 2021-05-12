const initialState = {
  userID: "",
  isLogin: false,
  blogID: "",
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
    default:
      return state;
  }
};

export default Reducer;
