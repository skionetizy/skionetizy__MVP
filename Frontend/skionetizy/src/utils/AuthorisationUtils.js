export const loginStatus = () => {
  const loginStatusValue = !!localStorage.getItem("userID");
  return loginStatusValue;
};
