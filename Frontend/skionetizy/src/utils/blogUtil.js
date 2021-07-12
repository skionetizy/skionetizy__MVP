export const saveBlogIDUtil = (blogID) => {
  localStorage.setItem("blogID", JSON.stringify(blogID));
};

export const getBlogIDUtil = () => {
  return JSON.parse(localStorage.getItem("blogID"));
};
