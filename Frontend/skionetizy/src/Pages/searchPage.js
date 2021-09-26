import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router";
import SearchBlogCard from "../Components/searchBlogCard";
import baseURL from "../utils/baseURL";
import style from "./searchPage.module.css";
import Footer from "../Components/Footer";

const SearchPage = (props) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = useParams();

  useEffect(() => {
    const loadBlogs = () => {
      setLoading(true);
      axios
        .post(`${baseURL}/blog/searchBlog`, { search: params.searchInput })
        .then((res) => {
          setLoading(false);

          console.log(res.data["Queried Data"]);
          if (res.data["Queried Data"]?.length >= 0)
            setBlogs(res.data["Queried Data"]);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };
    loadBlogs();
  }, [params.searchInput]);

  return (
    <>
      <div>
        <div className={style.container}>
          <div className={style.result_count}>
            {loading && <p>loading..</p>}
            <h3>
              <span>{blogs.length} </span>results found
            </h3>
          </div>

          <div className={style.blogs}>
            {blogs &&
              blogs.map((blog, blogIndex) => {
                return <SearchBlogCard blog={blog} key={blogIndex} />;
              })}
          </div>
        </div>
      </div>
      <Footer />
    </>
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
