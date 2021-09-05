import React, { useState } from "react";
import "./addBlogImage.css";
import { Link, useLocation } from "react-router-dom";
import { getLoggedInProfileID } from "../utils/AuthorisationUtils";
import validateImage from "../utils/validateImage";
import BlogSteps from "../Components/BlogSteps";

function Upload() {
  const [uploaded, setUploaded] = useState(false);
  const [proImage, setProImage] = useState();
  const [formData, setFormData] = useState("");
  const [success, setSuccess] = useState(false);

  const location = useLocation();

  const handleProfile = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const maxWidth = 1920;
    const maxHeight = 1080;

    if (await validateImage(file, { maxWidth, maxHeight })) {
      setProImage(URL.createObjectURL(file));
      setUploaded(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("blogID", JSON.parse(localStorage.getItem("blogID")));
      // formData.append("userID", JSON.parse(localStorage.getItem("userID")));
      formData.append("profileID", getLoggedInProfileID());
      setFormData(formData);
      console.log(formData);
    }
  };

  const url = "http://127.0.0.1:5000/blog/addBlogImage";

  const handlePublishBlog = (e) => {
    e.preventDefault();

    console.log({ body: formData });

    fetch(url, {
      method: "PATCH",
      body: formData,
    })
      .then((response) => {
        if (response.body.success) {
          setSuccess(true);
        }
        return response.json();
      })
      .then((body) => {
        console.log(body);
      });
  };
  return (
    <div className="upload_page">
      <div className="center">
        <BlogSteps noOfSteps={3} currentStep={2} />
      </div>
      <div className="upload-btn-wrapper">
        <img src={proImage} />
        <br />
        <input
          type="file"
          onChange={(e) => handleProfile(e)}
          id="actual-btn"
          hidden
          name="file"
        />
        <br />
        <label
          htmlFor="actual-btn"
          style={{ visibility: uploaded ? "hidden" : "block" }}
        >
          {"Choose a file"}
        </label>
        <br />
        {/* {uploaded && ( */}
        <div>
          {success && (
            <h2
              style={{ position: "relative", left: "-12%", color: "#3498db" }}
            >
              Uploaded successfully
            </h2>
          )}
          <Link to="/final">
            <button className="next" onClick={handlePublishBlog}>
              Publish Blog
            </button>
          </Link>

          <Link to={{ pathname: "/addBlogKeywords", state: location.state }}>
            <button className="next">Keywords</button>
          </Link>
        </div>
        {/* )} */}
      </div>
    </div>
  );
}

export default Upload;
