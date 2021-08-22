import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import ReactMarkdown from "react-markdown";
import axios from "axios";

import "./addBlogDetailsMarkdown.css";
import useDebounce from "../hooks/useDebounce";

import { getLoggedInProfileID } from "../utils/AuthorisationUtils";
import Editor from "../Components/Editor";

function MarkDown(props) {
  const [data, setData] = useState({
    blogDescription: "",
    blogTitle: "",
  });
  const [charactersRemaining, setCharactersRemaining] = useState(5000);

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
      //handle api
      // var blogID = null;
      // axios
      //   .post(url, {
      //     ...data,
      //   })
      //   .then((res) => {
      //     console.log(res.data);
      //     blogID = res.data.blog._id;
      //     localStorage.setItem("blogID", JSON.stringify(blogID));
      //   })
      //   .catch((err) => console.log(err));
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
    name === "blogDescription" &&
      setCharactersRemaining(5000 - data.blogDescription.length);
  };

  return (
    <div>
      <div className="mainmark">
        <div style={{ position: "relative", marginLeft: "5%", top: "14%" }}>
          <h3>Enter Blog Title</h3>
          <br />
          <input
            style={{
              backgroundColor: "#3498db",
              color: "white",
              padding: "5px",
              border: "1px solid transparent",
              outline: "none",
              borderRadius: "5px",
              width: "40%",
            }}
            onChange={handleChange("blogTitle")}
          />
        </div>
        <div className="characters">
          characters Remaining {charactersRemaining}
        </div>
        <div className="characters">
          blog description must be more than 200 characters
        </div>
        <div className="characters">
          blog title must be more than 6 characters
        </div>
        {/* <textarea
          autoFocus
          rows="40"
          cols="85"
          className="textarea"
          fixed
          onChange={handleChange("blogDescription")}
        /> */}
        <Editor
          className="textarea"
          onChange={(text) =>
            handleChange("blogDescription")({ target: { value: text } })
          }
        />
        <div className="pos">
          <button onClick={handleUpload} className="upload">
            Upload
          </button>
          <button className="upload">
            <Link
              to="/addBlogImage"
              style={{ textDecoration: "none", color: "white" }}
            >
              Next
            </Link>
          </button>
        </div>
        <h2
          style={{ position: "relative", marginTop: "-54%", marginLeft: "68%" }}
        >
          Preview
        </h2>
        <div>
          <ReactMarkdown source={data.blogDescription} className="markdown" />
        </div>
      </div>
    </div>
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
