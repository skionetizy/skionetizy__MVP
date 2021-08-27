import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import style from "../Pages/exploreBlogs.module.css";
import BlogCard from "../Components/BlogCard";
import BlogNavigation from "../Components/BlogNavigation";

import axios from "axios";
import useIObserver from "../hooks/useIntersectionObserver";
import Spinner from "../Components/Spinner";

const blogsPerPage = 6;
const url = "http://127.0.0.1:5000/blog/getBlogsAndProfileDetails";

function MyBlogs(props) {
  const [status, setStatus] = useState("idle");
  const [blogs, setBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(0);
  const [loading, setLoading] = useState(false);

  const viewMore = useIObserver();

  const startingIndex = currentBlog * blogsPerPage;
  const endingIndex = startingIndex + blogsPerPage;

  useEffect(() => {
    const loadBlogs = () => {
      setLoading(true);
      setStatus("loading");
      axios
        .get(url)
        .then((res) => {
          // console.log(Object.values(res.data.blogs);
          console.log(res.data);

          setBlogs(Object.values(res.data.blogs));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setStatus("idle");
          setLoading(false);
        });
    };
    loadBlogs();
  }, []);

  const slicedBlogs = blogs.slice(0, endingIndex);

  useEffect(() => {
    if (viewMore.isVisible && status === "idle" && blogs.length > 0) {
      console.log("Fetch more blogs");
      setStatus("loading");

      // fake delay for 5 seconds
      setTimeout(() => {
        if (slicedBlogs.length + blogsPerPage > blogs.length)
          setStatus("completed");
        else setStatus("idle");

        setCurrentBlog((prev) => prev + 1);
      }, 5000);
    }
  }, [blogs.length, slicedBlogs.length, status, viewMore.isVisible]);

  props.saveSlicedBlogs(slicedBlogs);

  return (
    <div>
      <div
        className={`${style.blogCardContainer} ${style.container} ${style.body}`}
      >
        {loading && <p className={style.statusMessage}>loading..</p>}
        {slicedBlogs &&
          slicedBlogs.map((blog) => {
            return <BlogCard blog={blog} />;
          })}
      </div>
      {/* <BlogNavigation
        blogsPerPage={blogsPerPage}
        blogsLength={blogs.length}
        setCurrentBlog={(currBlog) => setCurrentBlogHandler(currBlog)}
      /> */}

      {/* intersection observer target span */}
      <span ref={viewMore.targetRef} className={style.viewMore}>
        view more span target. js uses it to detect when user has scroll to
        bottom to this span and then fetch more blogs. this span is visually
        hidden using css
      </span>

      {/* Loading Spinner */}
      {status === "loading" && (
        <div className={style.spinnerWrapper}>
          <Spinner color="white" fontSize="2rem" />
        </div>
      )}

      {/* Status Message */}
      {status === "completed" && (
        <p className={style.statusMessage}>🎉You have reached to end</p>
      )}
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveSlicedBlogs: (blogs) =>
      dispatch({ type: "SAVE_SLICED_BLOGS", payload: blogs }),
  };
};
export default connect(null, mapDispatchToProps)(MyBlogs);
