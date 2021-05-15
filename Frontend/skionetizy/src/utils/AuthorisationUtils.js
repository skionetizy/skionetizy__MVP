export const isAuthenticated = () => {
  const isAuthenticatedStatus = !!localStorage.getItem("userID");
  return isAuthenticatedStatus;
};

export const userRole = () => {
  const userRole = localStorage.getItem("userRole");
  return userRole;
};
