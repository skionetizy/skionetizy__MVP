import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import ReactMarkdown from "react-markdown";
import axios from "axios";

import "./marDown.css";
function MarkDown() {
  // const [input, setInput] = useState("");
  // const [blogTitle, setBlogTitle] = useState("");
  const [data, setData] = useState({
    blogDescription: "",
    blogTitle: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.input.length <= 200) {
      alert("blog description must be greater than 200 characters");
    } else if (data.blogTitle <= 6) {
      alert("blog title must be more than 6 characters");
    } else {
      axios.post();
    }
  };

  const handleChange = (name) => (e) => {
    e.preventDefault();
    setData({
      ...data,
      [name]: e.target.value,
    });
  };

  return (
    <div className="mainmark">
      <div style={{ position: "absolute", left: "5%", top: "14%" }}>
        <p onChange={handleChange("blogTitle")}>Enter Blog Title</p>
        <br />
        <input
          style={{
            backgroundColor: "#3498db",
            color: "white",
            padding: "5px",
            border: "1px solid transparent",
            outline: "none",
            borderRadius: "5px",
            width: "110%",
          }}
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
      <div>
        <ReactMarkdown source={data.blogDescription} className="markdown" />
      </div>
      <button onSubmit={handleSubmit}>Upload</button>
      <button>
        <Link to="/upload">Next</Link>
      </button>
    </div>
  );
}

export default MarkDown;
