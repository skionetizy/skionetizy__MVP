import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { connect, useSelector } from "react-redux";
import { useHistory, useLocation, Prompt } from "react-router-dom";
import * as yup from "yup";
import BlogStatusBadge from "../Components/BlogStatusBadge";
import BlogSteps from "../Components/BlogSteps";
import Button from "../Components/Button";
import Editor from "../Components/Editor";
import useAuth from "../hooks/useAuth";
import useDebounceGeneral from "../hooks/useDebounceGeneral";
import baseURL from "../utils/baseURL";
import getYupErrors from "../utils/getYupErrors";
import {
  CURRENT_EDITING_BLOG,
  CURRENT_NEW_ADD_BLOG,
} from "../utils/localStorageKeys";
import styles from "./addBlogDetailsMarkdown.module.css";

function MarkDown(props) {
  const mode = useSelector((store) => store.markdownMode);
  const [data, setData] = useState(() => getMarkdownFromLocalStorage(mode));
  const [hasNewChanges, setHasNewChanges] = useState(false);
  const [errors, setErrors] = useState({});
  const [isGrammarVisible, setIsGrammarVisible] = useState(false);
  const [status, setStatus] = useState("idle");
  const history = useHistory();
  const debounce = useDebounceGeneral(data, 4000);
  const auth = useAuth();
  const [shouldLoadData, setShouldLoadData] = useState(false);
  const isFirstRender = useRef(true);
  const { isLoggedIn } = useAuth();

  const handleUpload = async (e) => {
    console.log("handleUpload");
    try {
      setStatus("loading");
      const validatedData = await markdownSchema.validate(data, {
        abortEarly: false,
        context: true,
      });
      const payloadData = {
        ...validatedData,
        profileID: auth.profile?.profileID,
        type: data.type || "DRAFTED",
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

      // localStorage.setItem(CURRENT_EDITING_BLOG, JSON.stringify(resBlog));
      const saveStatus = setMarkdownToLocalStorage(mode, resBlog);
      if (saveStatus === false) throw Error("Application Error");

      setStatus("success");
      setHasNewChanges(false);
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
      } else if (error.message === "Application Error") {
        setErrors({
          axiosError: error.message,
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
    setMarkdownToLocalStorage(mode, debounce);
    // localStorage.setItem(CURRENT_EDITING_BLOG, JSON.stringify(debounce));
    setHasNewChanges(false);
  }, [debounce]);

  useEffect(() => {
    if (!isFirstRender.current) {
      setData(getMarkdownFromLocalStorage(mode));
      setShouldLoadData(true);
    } else {
      isFirstRender.current = false;
    }
  }, [mode]);

  if (!isLoggedIn) {
    history.push("/login");
    return;
  }

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
          <p className={styles.error}>{errors.blogTitle}</p>
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
              shouldLoadData={shouldLoadData}
              handleStopLoadData={() => setShouldLoadData(false)}
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
          <p className={styles.error}>&nbsp; {errors.blogDescription}</p>
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
  return axios.post(`${baseURL}/blog/addBlogDescriptionAndTitle`, data);
};

const updateBlogDescriptionAndTitleAPI = (data) => {
  return axios.patch(`${baseURL}/blog/updateBlogDescriptionAndTitle`, data);
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
      (value) => value.split(" ").filter(Boolean).length >= 200
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

function isValidUrl(urlString) {
  return /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(
    urlString
  );
}

export function getMarkdownFromLocalStorage(mode) {
  let data;
  const key = mode === "add" ? CURRENT_NEW_ADD_BLOG : CURRENT_EDITING_BLOG;

  try {
    data = JSON.parse(localStorage.getItem(key)) ?? {
      blogTitle: "",
      blogDescription: "",
    };
  } catch (error) {
    data = {
      blogTitle: "",
      blogDescription: "",
    };
  }

  return data;
}

export function setMarkdownToLocalStorage(mode, data) {
  const key = mode === "add" ? CURRENT_NEW_ADD_BLOG : CURRENT_EDITING_BLOG;

  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    return false;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MarkDown);
