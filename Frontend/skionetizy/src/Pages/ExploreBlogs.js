import React, { useState, useEffect } from "react";
import style from "../Pages/exploreBlogs.module.css";
import NavExploreBlogs from "../Components/NavExploreBlogs";
import BlogCard from "../Components/BlogCard";
import BlogNavigation from "../Components/BlogNavigation";
import axios from "axios";

function MyBlogs() {
  const [blogsPerPage, setBlogsPerPage] = useState(12);
  // const [blogs, setBlogs] = useState([
  //   {
  //     blogID: "blogID",
  //     blogTitle: "blogTitle",
  //     likesCount: "likesCount",
  //     dislikesCount: "dislikesCount",
  //   },
  // ]);
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

          // console.log(Object.values(res.data.blogs);

          setBlogs(Object.values(res.data.blogs));
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };
    loadBlogs();
  }, []);

  const slicedBlogs = blogs.slice(startingIndex, endingIndex);
  // console.log(slicedBlogs);

  return (
    <div>
      {/* <NavExploreBlogs /> */}
      <div
        className={`${style.blogCardContainer} ${style.container} ${style.body}`}
      >
        {loading && <p>loading..</p>}
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
