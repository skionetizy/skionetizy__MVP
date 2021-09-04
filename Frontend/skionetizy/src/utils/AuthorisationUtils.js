export const isAuthenticated = () => {
  const isAuthenticatedStatus = !!getLoggedInProfileID();
  return isAuthenticatedStatus;
};

export const userRole = () => {
  const userRole = localStorage.getItem("userRole");
  return userRole;
};

export const getLoggedInUserID = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("userID"));
  return loggedInUser;
};

export const getLoggedInProfileID = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("profileID"));
  return loggedInUser;
};

export const getLoggedInProfileUserName = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("profileUserName"));
  return loggedInUser;
};
