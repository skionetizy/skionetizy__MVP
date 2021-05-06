import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import ReactMarkdown from "react-markdown";
import axios from "axios";

import "./marDown.css";
import useDebounce from "../hooks/useDebounce";

function MarkDown() {
  const [data, setData] = useState({
    blogDescription: "",
    blogTitle: "",
  });

  const debounceData = useDebounce(data, 5000);
  const url = "http://127.0.0.1:5000/addBlogDescriptionAndText";

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
      handleAPI();
    }
  };

  const handleAPI = () => {
    var blogID;
    axios
      .post(url, {
        ...data,
      })
      .then((res) => {
        console.log(res.data);
        blogID = res.data.blog._id;
        localStorage.setItem("blogID", JSON.stringify(blogID));
      })
      .catch((err) => console.log(err));
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
      }
    }
  }, [debounceData.blogTitle, debounceData.blogDescription]);

  const handleChange = (name) => (e) => {
    e.preventDefault();
    setData({
      ...data,
      [name]: e.target.value,
    });
    console.log({ name });
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
        <textarea
          autoFocus
          rows="40"
          cols="85"
          className="textarea"
          fixed
          onChange={handleChange("blogDescription")}
        />
        <div className="pos">
          <button onClick={handleUpload} className="upload">
            Upload
          </button>
          <button className="upload">
            <Link
              to="/upload"
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

export default MarkDown;
