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
import Spinner from "../Components/Spinner";
import baseURL from "../utils/baseURL";
import { CURRENT_EDITING_BLOG } from "../utils/localStorageKeys";

const addBlogDescriptionAndTitleAPI = (data) => {
  return axios.post(`${baseURL}/blog/addBlogDescriptionAndTitle`, {
    blogTitle: data.blogTitle,
    blogDescription: data.blogDescription,
    profileID: getLoggedInProfileID(),
  });
};

const updateBlogDescriptionAndTitleAPI = (data) => {
  return axios.patch(`${baseURL}/blog/updateBlogDescriptionAndTitle`, {
    blogID: data.blogID,
    blogTitle: data.blogTitle,
    blogDescription: data.blogDescription,
    profileID: getLoggedInProfileID(),
  });
};

const markdownSchema = yup.object().shape({
  blogTitle: yup
    .string()
    .required("Blog Title is required")
    .min(6, "Blog Title should atleast be of 6 characters"),
  blogDescription: yup
    .string()
    .required("Blog description is required")
    .test(
      "test-blog-words",
      "Blog Description should alleast contain 200 words",
      (value) => value.split(" ").filter(characterLike).length >= 200
    ),
});

function MarkDown(props) {
  const [data, setData] = useState(() => {
    return (
      JSON.parse(localStorage.getItem(CURRENT_EDITING_BLOG)) || {
        blogTitle: "",
        blogDescription: "",
      }
    );
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const location = useLocation();
  const history = useHistory();
  const debounceData = useDebounce(data, 300000); //5min is 300000 ms

  const handleUpload = async (e) => {
    try {
      setStatus("loading");
      const validatedData = await markdownSchema.validate(data, {
        abortEarly: false,
        context: true,
      });

      setErrors({});

      const blogID = data.blogID;
      let promise;
      if (!blogID) {
        promise = addBlogDescriptionAndTitleAPI(validatedData);
      } else {
        promise = updateBlogDescriptionAndTitleAPI({
          ...validatedData,
          blogID,
        });
      }

      const blogDetails = (await promise).data.blog;

      localStorage.setItem(CURRENT_EDITING_BLOG, JSON.stringify(blogDetails));
      history.push("/addBlogImage");
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setErrors(getYupErrors(error));
        window.scrollTo({ behavior: "smooth", left: 0, top: 0 });
      } else if (error.isAxiosError) {
        setErrors({
          axiosError: error?.response?.data?.Message || "Server Error",
        });
      } else {
        throw error;
      }
    }
  };

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
                initialData={data.blogDescription}
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
          <button
            className={styles.button}
            onClick={() => {
              handleUpload();
            }}
          >
            {status === "loading" ? (
              <>
                <Spinner />
                {data.blogStatus === "DRAFTED" ? "Saving as Draft" : "Saving"}
              </>
            ) : (
              "Next"
            )}
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
