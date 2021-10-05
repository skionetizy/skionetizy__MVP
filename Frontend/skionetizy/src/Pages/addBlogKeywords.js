import React, { useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { Link, useHistory } from "react-router-dom";
import {
  addKeywords,
  getKeywords,
  getKeywordsByAI,
} from "../API/blogAPIHandler";
import useMutate from "../hooks/useMutate";
import KeywordsIllustration from "../Assets/add_keywords.svg";
import BlogSteps from "../Components/BlogSteps";
import Button from "../Components/Button";
import { getLoggedInProfileUserName } from "../utils/AuthorisationUtils";
import { CURRENT_EDITING_BLOG } from "../utils/localStorageKeys";
import styles from "./addBlogKeywords.module.css";
import useAsync from "../hooks/useAsync";
import * as yup from "yup";
import useAuth from "../hooks/useAuth";
import PublishBlogModal from "../Components/PublishBlogModal";
import {
  getMarkdownFromLocalStorage,
  setMarkdownToLocalStorage,
} from "./addBlogDetailsMarkdown";
import { useSelector } from "react-redux";

function AddBlogKeywords() {
  const mode = useSelector((store) => store.markdownMode);
  const [blog] = useState(() => getMarkdownFromLocalStorage(mode));
  const [keywords, setKeywords] = useState(
    () => blog?.metaData?.metaKeywords.split(",") || []
  );
  const [keywordValue, setKeywordValue] = useState("");
  const [keywordSearchValue, setKeywordSearchValue] = useState("");
  const { isLoggedIn, profile } = useAuth();
  const history = useHistory();
  const [message, setMessage] = useState("");
  const [showLoadingToBtn, setShowLoadingToBtn] = useState("");

  const blogMutate = useMutate({
    mutateFn: (type) =>
      blogKeywordsSchemaValidate({
        blogID: blog.blogID,
        metaTitle: blog.blogTitle,
        metaDescription: blog.blogDescription.substr(0, 140),
        metaKeywords: keywords.filter(Boolean).toString(),
        type,
      })
        .then((data) => addKeywords(data))
        .then((res) => res.data),

    onSuccess: () => {
      setMarkdownToLocalStorage(mode, null);
      setMessage("Published Blog");
    },
  });

  function handleAddKeywords(inputValue) {
    const newKeywords = inputValue
      .split(",")
      .filter(Boolean)
      .filter((word) => !keywords.includes(word));

    setKeywords((prev) => [...prev, ...newKeywords]);
  }

  const searchKeywords = useAsync(() => {
    if (keywordSearchValue)
      return getKeywords(keywordSearchValue).then((res) => res.data.data);
  }, null);

  const blogDescription = blog?.blogDescription;

  const aiKeywords = useAsync(
    () => {
      if (blogDescription)
        return getKeywordsByAI({ blogDescription }).then(
          (r) => r.data.Keywords
        );
      else return [];
    },
    [],
    [blogDescription]
  );

  useEffect(() => {
    if (message !== "") {
      setTimeout(() => setMessage(""), 5000);
    }
  }, [message]);

  if (blog == null)
    return (
      <div className={styles.wrapper}>
        <div className="center">
          <BlogSteps noOfSteps={3} currentStep={3} />
        </div>

        <div className="center">
          <p>No Blog Selected</p>
          <p>Please go to edit blog and then select addKeywords from their</p>

          <Link className={styles.button} to="/addBlogDetailsMarkdown">
            Edit Blog
          </Link>
        </div>
      </div>
    );

  if (isLoggedIn === false) {
    history.push("/login");
  }

  return (
    <>
      <div className="center">
        <BlogSteps noOfSteps={3} currentStep={3} />
      </div>

      <div className={styles.wrapper}>
        <h1 className={styles.title}>Keywords</h1>

        <div className={styles.keywordsList}>
          {aiKeywords.isLoading ? (
            <span>Generating...</span>
          ) : aiKeywords.isError ? (
            <span>: (</span>
          ) : aiKeywords.data?.length > 0 ? (
            (console.log(aiKeywords.data),
            aiKeywords.data.map((word) => (
              <span key={word} className={styles.keyword}>
                {word}
              </span>
            )))
          ) : null}
        </div>

        {/* flex wrap */}
        <section className={styles.flexWrap}>
          <div className={styles.flexItem}>
            <h3 className={styles.label}>Tags</h3>

            <form
              onSubmit={(ev) => {
                ev.preventDefault();
                const inputValue = ev.target.elements.tag.value;
                handleAddKeywords(inputValue);
                setKeywordValue("");
              }}
            >
              <input
                name="tag"
                className={styles.input}
                value={keywordValue}
                onChange={(ev) => {
                  if (ev.target.value.endsWith(",")) {
                    handleAddKeywords(ev.target.value);
                    setKeywordValue("");
                  } else {
                    setKeywordValue(ev.target.value);
                  }
                }}
                placeholder="Ex. Delicious, Sea Food, Tuna Sushi Roll"
              />
            </form>

            <div className={styles.keywordsList}>
              {keywords.map((keyword) => (
                <span key={keyword} className={styles.keyword}>
                  {keyword}
                  <button
                    className={styles.keywordDeleteBtn}
                    onClick={() =>
                      setKeywords((prev) =>
                        prev.filter((word) => word !== keyword)
                      )
                    }
                  >
                    <FiX width="1em" />
                  </button>
                </span>
              ))}
            </div>

            <p className="error">{blogMutate.errors.metaKeywords}</p>

            <p>
              Tags can be useful if content in your video is commonly
              misspelled. Otherwise, tags play a minimal role in helping viewers
              find your video.
            </p>

            <img
              className={styles.img}
              src={KeywordsIllustration}
              height="400px"
              width="300px"
              alt=""
            />
          </div>

          <div className={styles.flexItem}>
            <h3 className={styles.label}>Keyword Finder</h3>

            {/* Search Input */}
            <form
              className={styles.searchInput}
              onSubmit={(e) => {
                e.preventDefault();
                searchKeywords.run();
              }}
            >
              <input
                value={keywordSearchValue}
                onChange={(ev) => setKeywordSearchValue(ev.target.value)}
                placeholder="Enter a keyword here"
              />
              <button>
                <FiSearch width="1em" />
              </button>
            </form>

            {/* Table */}
            <div className={styles.keywordsTableWrapper}>
              <table className={styles.keywordsTable}>
                <thead className={styles.keywordsTableHeader}>
                  <tr>
                    <th>Keyword</th>
                    <th>Average Searches</th>
                    <th>Competition Index</th>
                    <th>Competition Level</th>
                    <th>Annotation</th>
                  </tr>
                </thead>

                <tbody>
                  {searchKeywords.isSuccess &&
                    Array(5)
                      .fill()
                      .map((_, idx) => (
                        <tr className={styles.keywordRow}>
                          <td>{searchKeywords.data["Keyword"][idx]}</td>
                          <td>
                            {searchKeywords.data["Average Searches"][idx]}
                          </td>
                          <td>
                            {searchKeywords.data["Competition Index"][idx]}
                          </td>
                          <td>
                            {searchKeywords.data["Competition Level"][idx]}
                          </td>
                          <td>
                            {searchKeywords.data["List Annotations"][
                              idx
                            ]?.toString() || (
                              <span style={{ opacity: 0.4 }}>None</span>
                            )}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {message && (
          <p style={{ color: "white", margin: 0 }} className="center">
            {message}
          </p>
        )}

        <div className={styles.actions}>
          <Button
            link
            className={styles.button}
            to={`/${profile?.profileUserName}`}
          >
            Back to Profile
          </Button>

          <Button
            size="normal"
            variant="primary"
            isLoading={showLoadingToBtn === "IN_REVIEW" && blogMutate.isLoading}
            disabled={blogMutate.isLoading}
            onClick={() => {
              setShowLoadingToBtn("IN_REVIEW");
              blogMutate.mutate("IN_REVIEW");
            }}
            className={styles.button}
          >
            Publish for Review
          </Button>

          <Button
            className={styles.button}
            size="normal"
            variant="primary"
            isLoading={showLoadingToBtn === "DRAFTED" && blogMutate.isLoading}
            disabled={blogMutate.isLoading}
            onClick={() => {
              setShowLoadingToBtn("DRAFTED");
              blogMutate.mutate("DRAFTED");
            }}
          >
            Publish for Draft
          </Button>
        </div>
      </div>
    </>
  );
}

const blogKeywordsSchemaValidate = (data) =>
  yup
    .object({
      blogID: yup.string().required(),
      metaTitle: yup.string().min(6).required(),
      metaDescription: yup.string().min(50).required(),
      metaKeywords: yup.string().min(20).required(),
      type: yup.string().required().oneOf(["DRAFTED", "IN_REVIEW"]),
    })
    .validate(data, {
      stripUnknown: true,
      abortEarly: false,
      context: true,
    });

export default AddBlogKeywords;
