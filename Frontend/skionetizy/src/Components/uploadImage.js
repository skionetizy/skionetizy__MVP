import React, { useState } from "react";
import "./upload.css";
import { Link } from "react-router-dom";
function Upload() {
  const [uploaded, isUploaded] = useState(false);
  const [proImage, setProImage] = useState();
  const [formData, setFormData] = useState("");

  const handleProfile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const maxWidth = 1920;
    const maxHeight = 1080;
    const img = new Image();
    img.src = window.URL.createObjectURL(file);
    const maxFileSize = 1024 * 1024; //1mb
    img.onload = () => {
      const ext = [".jpg", ".jpeg", ".png", ".svg"];
      const filename = file.name;
      console.log(filename);
      console.log(img.width);
      console.log(img.height);

      if (file.type.match("image.*") && file.size > maxFileSize) {
        alert(
          "The selected image file is too big. Please choose one that is smaller than 1 MB."
        );
      } else if (!ext.some((el) => filename.endsWith(el))) {
        alert("only upload images of .jpg,.jpeg,.png,.svg");
      }
      // else if (
      //   file.type.match("image.*") &&
      //   (img.width !== maxWidth || img.height !== maxHeight)
      // ) {
      //   alert(
      //     `The selected image is too big. Please choose one with maximum dimensions of ${maxWidth}x${maxHeight}.`
      //   );
      //   return;
      // }
      else {
        setProImage(URL.createObjectURL(file));
        isUploaded(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("blogID", JSON.parse(localStorage.getItem("blogID")));
        formData.append("userID", JSON.parse(localStorage.getItem("userID")));
        setFormData(formData);
        console.log(formData);
      }
    };
  };

  const url = "http://127.0.0.1:5000/addBlogImage";

  const handlePublishBlog = (e) => {
    e.preventDefault();

    console.log({ body: formData });
    // const body = {
    //   formData: formData,
    //   blogID: JSON.parse(localStorage.getItem("blogID")),
    // };
    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        return response.json();
      })
      .then((body) => {
        console.log(body);
      });
  };
  return (
    <div className="upload_page">
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
          <h2 style={{ position: "relative", left: "-12%", color: "#3498db" }}>
            Uploaded successfully
          </h2>
          <Link to="/final">
            <button className="next" onClick={handlePublishBlog}>
              Publish Blog
            </button>
          </Link>
        </div>
        {/* )} */}
      </div>
    </div>
  );
}

export default Upload;
