import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import * as yup from "yup";
import BlogSteps from "../Components/BlogSteps";
import Editor from "../Components/Editor";
import useDebounce from "../hooks/useDebounce";
import { getLoggedInProfileID } from "../utils/AuthorisationUtils";
import getYupErrors from "../utils/getYupErrors";
import styles from "./addBlogDetailsMarkdown.module.css";

const markdownSchema = yup.object().shape(
  {
    blogTitle: yup
      .string()
      .required("Blog Title is required")
      .min(6, "Blog Title should atleast be of 6 characters"),
    blogDescription: yup
      .string()
      .required("Blog description is required")
      .test(
        "test-blog-words",
        "Blog Description should alleast contain 5000 words",
        (value) => value.split(" ").filter(characterLike).length >= 5
      ),
  }
  // [["blogDescription", "blogDescription"]]
);

function MarkDown(props) {
  const [data, setData] = useState({
    blogTitle: "",
    blogDescription: "",
  });
  const [errors, setErrors] = useState({});
  const location = useLocation();
  const history = useHistory();
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
    setData((data) => ({
      ...data,
      [name]: e.target.value,
    }));
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
            <input
              className={styles.input}
              placeholder="Enter Title"
              value={data.blogTitle}
              onChange={handleChange("blogTitle")}
            />
          </label>
          <p>{errors.blogTitle}</p>
        </div>

        <div className={styles.footer}>
          <div className={styles.descriptionInput}>
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
          <p>{errors.blogDescription}</p>
        </div>

        <div className={styles.actions}>
          <button onClick={handleUpload} className={styles.button}>
            Upload
          </button>

          <button
            className={styles.button}
            onClick={() => {
              markdownSchema
                .validate(data, { abortEarly: false, context: true })
                .then(() => {
                  setErrors({});
                  history.push("/addBlogImage", location.state);
                  // save to drafts
                })
                .catch((error) => {
                  setErrors(getYupErrors(error));
                  window.scrollTo({ behavior: "smooth", left: 0, top: 0 });
                });
            }}
          >
            Next
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

function characterLike(word) {
  return /[A-z|\d]+/.test(word);
}

export default connect(mapStateToProps, mapDispatchToProps)(MarkDown);
