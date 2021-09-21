import React, { useState } from "react";
import "./addBlogImage.css";
import { Link, useHistory, useLocation } from "react-router-dom";
import { getLoggedInProfileID } from "../utils/AuthorisationUtils";
import validateImage from "../utils/validateImage";
import BlogSteps from "../Components/BlogSteps";
import { CURRENT_EDITING_BLOG } from "../utils/localStorageKeys";
import baseURL from "../utils/baseURL";
import Spinner from "../Components/Spinner";

function Upload() {
  const [uploaded, setUploaded] = useState(false);
  const [proImage, setProImage] = useState();
  const [formData, setFormData] = useState("");
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState(
    () => JSON.parse(localStorage.getItem(CURRENT_EDITING_BLOG)) || {}
  );
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();

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
      formData.append("blogID", data.blogID);
      // formData.append("userID", JSON.parse(localStorage.getItem("userID")));
      formData.append("profileID", getLoggedInProfileID());
      setFormData(formData);
      console.log(formData);
    }
  };

  const url = `${baseURL}/blog/addBlogImage`;

  const handlePublishBlog = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();

      console.log({ body: formData });

      const response = await fetch(url, {
        method: "PATCH",
        body: formData,
      });

      console.log(response);
      if (!response.ok) throw new Error("Image Upload Failed");
      const data = await response.json();

      if (data.success !== true) throw new Error("Image Upload Failed");

      localStorage.setItem(
        CURRENT_EDITING_BLOG,
        JSON.stringify({
          ...data.blog,
          blogImageURL: data.blog.blogImageURL,
        })
      );

      setIsLoading(false);
      setSuccess(true);
      history.push("/addBlogKeywords");
    } catch (error) {
      alert(error.message);
      console.log(error);
      setIsLoading(false);
    }
  };
  return (
    <div className="upload_page">
      <div className="center">
        <BlogSteps noOfSteps={3} currentStep={2} />
      </div>
      <div className="upload-btn-wrapper">
        <img src={proImage || data.blogImageURL} alt="Blog Hero Thumbnail" />
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

          <button onClick={handlePublishBlog} className="next">
            {isLoading ? (
              <>
                <Spinner /> Saving
              </>
            ) : (
              "Next"
            )}
          </button>
        </div>
        {/* )} */}
      </div>
    </div>
  );
}

export default Upload;
