import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { connect } from "react-redux";
import { useHistory, useLocation, Prompt } from "react-router-dom";
import * as yup from "yup";
import BlogStatusBadge from "../Components/BlogStatusBadge";
import BlogSteps from "../Components/BlogSteps";
import Button from "../Components/Button";
import Editor from "../Components/Editor";
import useAuth from "../hooks/useAuth";
import useDebounce from "../hooks/useDebounce";
import useDebounceGeneral from "../hooks/useDebounceGeneral";
import baseURL from "../utils/baseURL";
import getYupErrors from "../utils/getYupErrors";
import { CURRENT_EDITING_BLOG } from "../utils/localStorageKeys";
import styles from "./addBlogDetailsMarkdown.module.css";

function MarkDown(props) {
  const [data, setData] = useState(() => {
    return (
      JSON.parse(localStorage.getItem(CURRENT_EDITING_BLOG)) || {
        blogTitle: "",
        blogDescription: "",
      }
    );
  });
  const [hasNewChanges, setHasNewChanges] = useState(false);
  const [errors, setErrors] = useState({});
  const [isGrammarVisible, setIsGrammarVisible] = useState(false);
  const [status, setStatus] = useState("idle");
  const location = useLocation();
  const history = useHistory();
  const debounce = useDebounceGeneral(data, 4000);
  const { isLoggedIn } = useAuth();
  const auth = useAuth();

  const handleUpload = async (e) => {
    try {
      setStatus("loading");
      const validatedData = await markdownSchema.validate(data, {
        abortEarly: false,
        context: true,
      });
      const payloadData = {
        ...validatedData,
        profileID: auth.profile?.profileID,
      };

      setErrors({});

      const blogID = data.blogID;
      let promise;
      if (!blogID) {
        promise = addBlogDescriptionAndTitleAPI(payloadData);
      } else {
        promise = updateBlogDescriptionAndTitleAPI({
          ...payloadData,
          blogID,
        });
      }

      const res = await promise;
      const { blog } = res.data;
      const resBlog = blogID ? validatedData : blog;

      localStorage.setItem(CURRENT_EDITING_BLOG, JSON.stringify(resBlog));
      history.push("/addBlogImage");
    } catch (error) {
      setStatus("error");
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
    setHasNewChanges(true);
    setData((data) => ({
      ...data,
      [name]: e.target.value,
    }));
    console.log({ name });
  };

  useEffect(() => {
    localStorage.setItem(CURRENT_EDITING_BLOG, JSON.stringify(debounce));
    setHasNewChanges(false);
  }, [debounce]);

  return (
    <>
      <Prompt
        when={hasNewChanges}
        message={(location) =>
          `New changes are not saved yet. Still want to proceed "${location.pathname}"?`
        }
      />
      <div className="center">
        <BlogSteps noOfSteps={3} currentStep={1} />
      </div>

      <div className={styles.wrapper}>
        <div className={styles.header}>
          <p>
            <BlogStatusBadge variant={data.blogID ? data.blogStatus : "LOCAL"}>
              {data.blogStatus || "LOCAL"}
            </BlogStatusBadge>
          </p>
          <p>{hasNewChanges ? "unsaved changes" : <>&nbsp;</>}</p>
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
          <label>
            <p className={styles.label}>Blog Description</p>
            <Editor
              className={styles.input}
              initialData={data.blogDescription}
              onChange={(text) =>
                handleChange("blogDescription")({ target: { value: text } })
              }
              onGrammarCheck={(error, _prediction) =>
                setIsGrammarVisible(!error)
              }
            />
          </label>

          <div className={styles.descriptionInfos}>
            {isGrammarVisible && (
              <span
                className={styles.grammarCheckIcon}
                data-grammar-desc="Ensure yourself of polished and error-free grammar with our grammar checker that checks for all types of typos and composition of sentences."
              >
                G
              </span>
            )}

            <span className={styles.descriptionLength}>
              {data.blogDescription.split(" ").filter(Boolean).length}/5000
            </span>
          </div>
          <p>&nbsp; {errors.blogDescription}</p>
        </div>

        <div className={styles.actions}>
          <Button isLoading={status === "loading"} onClick={handleUpload}>
            {status === "loading" ? "Saving" : "Next"}
          </Button>
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

const addBlogDescriptionAndTitleAPI = (data) => {
  return axios.post(`${baseURL}/blog/addBlogDescriptionAndTitle`, {
    blogTitle: data.blogTitle,
    blogDescription: data.blogDescription,
    profileID: data.profileID,
  });
};

const updateBlogDescriptionAndTitleAPI = (data) => {
  return axios.patch(`${baseURL}/blog/updateBlogDescriptionAndTitle`, {
    blogID: data.blogID,
    blogTitle: data.blogTitle,
    blogDescription: data.blogDescription,
    profileID: data.profileID,
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
    )
    .test("test-2", "Description must not contain any url", (value) => {
      const hasUrl = value.split(" ").some((word) => isValidUrl(word));
      return !hasUrl;
    }),
});

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

function isValidUrl(urlString) {
  return /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    urlString
  );
}
