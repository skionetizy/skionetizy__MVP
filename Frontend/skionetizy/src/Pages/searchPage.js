import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import BlogNavigation from "../Components/BlogNavigation";
import SearchBar from "../Components/searchBar";

import axios from "axios";

import SearchBlogCard from "../Components/searchBlogCard";
import baseURL from "../utils/baseURL";
import style from "./searchPage.module.css";

const SearchPage = (props) => {
  const [blogsPerPage, setBlogsPerPage] = useState(12);

  const [blogs, setBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(0);
  const [loading, setLoading] = useState(false);

  const startingIndex = currentBlog * blogsPerPage;
  const endingIndex = startingIndex + blogsPerPage;

  const setCurrentBlogHandler = (currBlog) => {
    setCurrentBlog(currBlog);
  };

  // const url = "http://127.0.0.1:5000/blog/getBlogs";
  const url = `${baseURL}/blog/getBlogs`;

  useEffect(() => {
    const loadBlogs = () => {
      setLoading(true);
      axios
        .get(url)
        .then((res) => {
          setLoading(false);

          console.log(Object.values(res.data.blogs));

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
  // console.log({ slicedBlogsAfterSlicing: slicedBlogs });
  props.saveSlicedBlogs(slicedBlogs);

  return (
    <div>
      <div className={style.container}>
        <SearchBar />
        <div className={style.result_count}>
          {loading && <p>loading..</p>}
          <h3>
            {/* <span>5 </span>results found */}
            <span>{props.filteredBlogs.length} </span>results found
          </h3>
        </div>
        {console.log({ filteredBlogsBM: props.filteredBlogs })}
        <div className={style.blogs}>
          {props.filteredBlogs &&
            props.filteredBlogs.map((blog, blogIndex) => {
              return <SearchBlogCard blog={blog} key={blogIndex} />;
            })}
          {console.log({ filteredBlogs: props.filteredBlogs })}
        </div>

        <BlogNavigation
          blogsPerPage={blogsPerPage}
          blogsLength={blogs.length}
          setCurrentBlog={(currBlog) => setCurrentBlogHandler(currBlog)}
        />
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    filteredBlogs: state.filteredBlogs,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveSlicedBlogs: (blogs) =>
      dispatch({ type: "SAVE_SLICED_BLOGS", payload: blogs }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
