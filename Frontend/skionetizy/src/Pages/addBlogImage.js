import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import BlogSteps from "../Components/BlogSteps";
import Spinner from "../Components/Spinner";
import useAuth from "../hooks/useAuth";
import baseURL from "../utils/baseURL";
import { CURRENT_EDITING_BLOG } from "../utils/localStorageKeys";
import Divider from "../Components/Divider";
import { FcGoogle } from "react-icons/fc";
import validateImage from "../utils/validateImage";
import Button from "../Components/Button";
import {
  setMarkdownToLocalStorage,
  getMarkdownFromLocalStorage,
} from "./addBlogDetailsMarkdown";
import "./addBlogImage.css";
import { Center } from "../Components/Layouts";
import { useSelector } from "react-redux";

function Upload() {
  const [uploaded, setUploaded] = useState(false);
  const [proImage, setProImage] = useState();
  const [formData, setFormData] = useState("");
  const [success, setSuccess] = useState(false);
  const mode = useSelector((store) => store.markdownMode);
  const [data] = useState(() => getMarkdownFromLocalStorage(mode));
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();

  const history = useHistory();
  const { isLoggedIn } = useAuth();

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
      formData.append("profileID", auth.profile?.profileID);
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
      if (uploaded === false) throw new Error("Select a image to upload");
      if (
        formData.get("blogID") == null ||
        formData.get("blogID") === "undefined"
      )
        throw new Error(
          "Your blog is currently local only. Please publish before uploading image"
        );
      const response = await fetch(url, {
        method: "PATCH",
        body: formData,
      });

      console.log(response);

      if (!response.ok) throw new Error("Image Upload Failed");
      const data = await response.json();

      if (data.success !== true) throw new Error("Image Upload Failed");

      setMarkdownToLocalStorage(mode, {
        ...data.blog,
        blogImageURL: data.blog.blogImageURL,
      });

      setIsLoading(false);
      setSuccess(true);
    } catch (error) {
      alert(error.message);
      console.log(error);
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    history.push("/login");
  }

  return (
    <div className="upload_page white">
      <div className="center">
        <BlogSteps noOfSteps={3} currentStep={2} />
      </div>

      <p className="center">Choose a 1920x1080 size image</p>

      <div className="upload-btn-wrapper">
        {proImage || data.blogImageURL ? (
          <img src={proImage || data.blogImageURL} alt="Blog Hero Thumbnail" />
        ) : null}

        <Center>
          <p>
            <input
              type="file"
              onChange={(e) => handleProfile(e)}
              id="actual-btn"
              hidden
              name="file"
            />
            <label
              htmlFor="actual-btn"
              style={{ visibility: uploaded ? "hidden" : "block" }}
            >
              Choose a Thumbnail
            </label>
          </p>
        </Center>

        <Center>
          <Divider className="white divider">Or</Divider>
        </Center>

        <Center>
          <Button
            link
            isExternalLink
            target="_blank"
            rel="noopener noreferrer"
            to="https://www.google.com/search?q=1920x1080+thumbnail&sxsrf=AOaemvLa0vDPE71muIofWUlbGVO4uQ7bMg:1633242634540&source=lnms&tbm=isch&sa=X&ved=2ahUKEwi_yMD4zq3zAhWPyTgGHU4tCoYQ_AUoAXoECAEQAw&biw=1280&bih=595&dpr=1.5"
            variant="secondary"
          >
            <FcGoogle fontSize="1.2em" />
            &nbsp; Search For Thumbnail
          </Button>
        </Center>

        {success && (
          <div>
            <h2
              style={{
                position: "relative",
                left: "-12%",
                color: "#3498db",
              }}
            >
              Uploaded successfully
            </h2>
          </div>
        )}

        <Center>
          <div className="next">
            <Button onClick={handlePublishBlog}>
              {isLoading ? (
                <>
                  <Spinner /> Uploading
                </>
              ) : (
                "Upload"
              )}
            </Button>

            <Button
              disabled={isLoading}
              variant="primary"
              onClick={() => history.push("/addBlogKeywords")}
            >
              Next
            </Button>
          </div>
        </Center>
      </div>
    </div>
  );
}

export default Upload;
