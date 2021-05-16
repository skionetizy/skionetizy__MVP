import React, { useState, useEffect } from "react";
import "../Components/ExploreBlogs.css";
import NavExploreBlogs from "../Components/NavExploreBlogs";
import BlogCard from "../Components/BlogCard";
import BlogNavigation from "../Components/BlogNavigation";
import axios from "axios";

function MyBlogs() {
  const [blogsPerPage, setBlogsPerPage] = useState(10);
  const [blogs, setBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(0);
  const [loading, setLoading] = useState(false);

  const startingIndex = currentBlog * blogsPerPage;
  const endingIndex = startingIndex + blogsPerPage;

  const setCurrentBlogHandler = (currBlog) => {
    setCurrentBlog(currBlog);
  };

  const url = "http://127.0.0.1:5000/blog/getBlogs";

  useEffect(() => {
    const loadBlogs = () => {
      setLoading(true);
      axios
        .get(url)
        .then((res) => {
          setLoading(false);
          console.log(res.data);
          //   setBlogs(res.data);
          setBlogs(Object.values(res.data));
          //   console.log(blogs);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };
    loadBlogs();
  }, []);

  const slicedBlogs = blogs.slice(startingIndex, endingIndex);

  return (
    <div>
      <NavExploreBlogs />
      <div className="blogcard-main">
        {/* <BlogCard />
        <BlogCard />
        <BlogCard />
        <BlogCard />
        <BlogCard />
        <BlogCard />
        <BlogCard />
        <BlogCard />
        <BlogCard /> */}
        {slicedBlogs &&
          slicedBlogs.map((blog) => {
            return <BlogCard blog={blog} />;
          })}
      </div>
      <BlogNavigation
        blogsPerPage={blogsPerPage}
        blogsLength={blogs.length}
        setCurrentBlog={(currBlog) => setCurrentBlogHandler(currBlog)}
      />
    </div>
  );
}

export default MyBlogs;
