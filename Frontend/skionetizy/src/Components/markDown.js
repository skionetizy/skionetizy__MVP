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
    <div>
      <div className="mainmark">
        <div style={{ position: "relative", marginLeft: "5%", top: "14%" }}>
          <h3 onChange={handleChange("blogTitle")}>Enter Blog Title</h3>
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
      
          <button onSubmit={handleSubmit} className="upload">
          Upload
        </button>
        <button className="upload">
          <Link to="/upload" style={{ textDecoration: "none", color: "white" }}>
            Next
          </Link>
        </button>
      </div>
        <h2 style={{position:'relative',marginTop:'-54%',marginLeft:'68%'}} >Preview</h2>
        <div>
          <ReactMarkdown source={data.blogDescription} className="markdown" />
        </div>
      </div>
      
    </div>
  );
}

export default MarkDown;
