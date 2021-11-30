import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router";
import SearchBlogCard from "../Components/searchBlogCard";
import baseURL from "../utils/baseURL";
import style from "./searchPage.module.css";
import Footer from "../Components/Footer";
import ViewMore from "../Components/ViewMore";
import Spinner from "../Components/Spinner";

const SearchPage = (props) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  // store the current search keyword
  const {searchInput} = useParams();
  // store the previous latest search keyword
  const [prevSearchfor, setprevSearchfor]=useState('');
  const [status, setStatus] = useState("idle");
  const [currentBlog, setCurrentBlog] = useState(0);
  const [hasMoreBlogs, setHasMoreBlogs] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [resultsFound, setResultsFound]=useState(0);
  
  useEffect(()=>{
    setBlogs([]);
    setCurrentBlog(0);
    setHasMoreBlogs(true);
    setResultsFound(0)
  },[searchInput])

  useEffect(() => {
    setprevSearchfor(searchInput)
    const loadBlogs = () => {
      setLoading(true);
      setStatus("loading");
      if (searchInput.length < 5){
        setStatus("idle");
        setLoading(false);
        return window.alert("Search length atleast be 5");
      }

      axios
        .post(`${baseURL}/blog/searchBlog/${currentBlog}`, { search: searchInput })
        .then((res) => {
          if (res.data["Queried Data"]?.length >= 0)
            setBlogs((prevBlogs)=>[...prevBlogs, ...res.data["Queried Data"]]);
            setResultsFound(res.data['resultsFound'])
        })
        .catch((err) => {
          console.log(err);
          if (err.response?.data.message === "exceeded bounds") {
            setHasMoreBlogs(false);
          }
        })
        .finally(()=>{
          setStatus("idle");
          setLoading(false);
        });
    };
    if (hasMoreBlogs || prevSearchfor!==searchInput) {
      loadBlogs();
    }
  }, [currentBlog, searchInput]);

  useEffect(() => {
    if (isVisible && status === "idle" && blogs.length && hasMoreBlogs) {
      setCurrentBlog((prev) => prev + 1);
    }
    console.log({ currentBlog });
  }, [blogs.length, hasMoreBlogs, isVisible, status]);

  return (
    console.log("Rendered"),
    <>
      <div>
        <div className={style.container}>
          <div className={style.result_count}>
            {loading && <p>loading..</p>}
            <h3>
              <span>{resultsFound} </span>results found
            </h3>
          </div>
          {resultsFound > 0 && (
            <div className={style.blogs}>
              {blogs && 
                blogs.map((blog, blogIndex) => 
                  <SearchBlogCard blog={blog} key={blogIndex} />
              )}
              {/* Show after initial fetching 9-12 blogs */}
              <ViewMore
                className={style.viewMore}
                onVisiblityChange={(isVisible) => setIsVisible(isVisible)}
              />
            </div>
          )}
          {/* Loading Spinner */}
          {status === "loading" && (
              <>
                <div className={style.spinnerWrapper}>
                  <Spinner color="white" />
                  <span className={style.statusMessage}>
                    Loading <span className="ani-typing">...</span>
                  </span>
                </div>
              </>
          )}
          {/* Status Message */}
          {(hasMoreBlogs === false) && (
            <p className={style.statusMessage}>🎉You have reached to end</p>
          )}
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
