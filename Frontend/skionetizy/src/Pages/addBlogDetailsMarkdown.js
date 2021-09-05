import React, { useState, useEffect } from "react";
import styles from "./addBlogDetailsMarkdown.module.css";
import { Link, useLocation } from "react-router-dom";
import { connect } from "react-redux";

import ReactMarkdown from "react-markdown";
import axios from "axios";

import useDebounce from "../hooks/useDebounce";

import { getLoggedInProfileID } from "../utils/AuthorisationUtils";
import Editor from "../Components/Editor";
import AddBlogSteps from "../Components/BlogSteps";
import BlogSteps from "../Components/BlogSteps";
import clsx from "../utils/clsx";

function MarkDown(props) {
  const [data, setData] = useState({
    blogDescription: "",
    blogTitle: "",
  });
  const location = useLocation();
  const debounceData = useDebounce(data, 300000); //5min is 300000 ms
  const addBlogDescriptionAndTitleURL =
    "http://127.0.0.1:5000/blog/addBlogDescriptionAndTitle";
  const UpdateBlogDescriptionAndTitleURL =
    "http://127.0.0.1:5000/blog/updateBlogDescriptionAndTitle";
  const handleUpload = (e) => {
    if (e) {
      e.preventDefault();
    }

    if (data.blogDescription.length <= 200) {
      alert("blog description must be greater than 200 characters");
    } else if (data.blogTitle <= 6) {
      alert("blog title must be more than 6 characters");
    } else {
      var blogID = null;
      if (!blogID) {
        blogID = addBlogDescriptionAndTitleAPI();
      } else {
        updateBlogDescriptionAndTitleAPI(blogID);
      }
    }
  };

  const updateBlogDescriptionAndTitleAPI = (blogID) => {
    axios.patch(UpdateBlogDescriptionAndTitleURL, {
      ...data,
      // userID: JSON.parse(localStorage.getItem("userID"))
      profileID: getLoggedInProfileID(),
    });
  };

  const addBlogDescriptionAndTitleAPI = () => {
    // console.log({ userID: props.userID });
    var blogID;
    axios
      .post(addBlogDescriptionAndTitleURL, {
        // ...data,
        blogTitle: data.blogTitle,
        blogDescription: data.blogDescription,
        // userID: props.userID,
        // userID: JSON.parse(localStorage.getItem("userID")),
        profileID: getLoggedInProfileID(),
      })
      .then((res) => {
        console.log(res.data);
        blogID = res.data.blog._id;
        localStorage.setItem("blogID", JSON.stringify(blogID.$uuid));
        // props.saveBlogID(blogID);
      })
      .catch((err) => console.log(err));

    return blogID;
  };

  useEffect(() => {
    if (debounceData) {
      console.log({ debounceData });
      if (debounceData.blogDescription.length <= 200) {
        console.log("blog description must be greater than 200 characters");
      } else if (debounceData.blogTitle.length <= 6) {
        console.log("blog title must be more than 6 characters");
      } else {
        //handle api call
        // console.log("entered use effect in markdown");
        // const blogID;
        // axios
        //   .post(url)
        //   .then((res) => {
        //     console.log(res.data);
        //     blogID = res.data.blog._id;
        //   })
        //   .catch((err) => console.log(err));
        var blogID = null;
        if (!blogID) {
          blogID = addBlogDescriptionAndTitleAPI();
        } else {
          updateBlogDescriptionAndTitleAPI(blogID);
        }
      }
    }
  }, [debounceData.blogTitle, debounceData.blogDescription]);

  const handleChange = (name) => (e) => {
    // e.preventDefault();
    setData({
      ...data,
      [name]: e.target.value,
    });
    console.log({ name });
  };

  return (
    <>
      <div className="center">
        <BlogSteps noOfSteps={3} currentStep={1} />
      </div>

      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Blog Details</h1>

          <label>
            <p className={styles.label}> Blog Title</p>
            <input className={styles.input} placeholder="Enter Title" />
            <p>Minimum 6 characters</p>
          </label>
        </div>

        <div className={clsx(styles.footer, styles.descriptionInput)}>
          <label>
            <p className={styles.label}>Blog Description</p>
            <Editor
              className={styles.input}
              onChange={(text) =>
                handleChange("blogDescription")({ target: { value: text } })
              }
            />
          </label>
          <p className={styles.descriptionTextLength}>
            {data.blogDescription.length}/5000
          </p>
        </div>

        <div className={styles.actions}>
          <button onClick={handleUpload} className={styles.button}>
            Upload
          </button>
          <button className={styles.button}>
            <Link
              to={{ pathname: "/addBlogImage", state: location.state }}
              style={{ textDecoration: "none", color: "white" }}
            >
              Next
            </Link>
          </button>
        </div>

        <div className={styles.blogPreview}>
          <p className={styles.label}>Preview</p>
          <ReactMarkdown
            source={data.blogDescription}
            className={styles.input}
          />
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    userID: state.userID,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveBlogID: (blogID) => dispatch({ type: "SAVE_BLOG_ID", blogID: blogID }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MarkDown);
