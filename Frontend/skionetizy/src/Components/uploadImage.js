import React, { useState } from "react";
import "./upload.css";
import { Link } from "react-router-dom";
function Upload() {
  const [uploaded, isUploaded] = useState(false);
  const [proImage, setProImage] = useState();
  const handleProfile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const maxWidth = 1920;
    const maxHeight = 1080;
    const img = new Image();
    img.src = window.URL.createObjectURL(file);
    img.onload = () => {
      // if (file.type.match('image.*') && file.size > maxFileSize) {
      //   alert('The selected image file is too big. Please choose one that is smaller than 5 MB.');

      if (
        file.type.match("image.*") &&
        (img.width !== maxWidth || img.height !== maxHeight)
      ) {
        alert(
          `The selected image is too big. Please choose one with maximum dimensions of ${maxWidth}x${maxHeight}.`
        );
        return;
      } else {
        setProImage(URL.createObjectURL(file));
        isUploaded(true);
      }
    };
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
        />
        <br />
        <label
          htmlFor="actual-btn"
          style={{ visibility: uploaded ? "hidden" : "block" }}
        >
          {"Choose a file"}
        </label>
        <br />
{   uploaded &&  <div>

          <h2 style={{position:'relative',left:'-12%',color:'#3498db'}}>Uploaded successfully</h2>
          <Link to="/final"> 
          <button className="next">Next</button>
          </Link>
      
         </div>  }
      </div>
    </div>
  );
}

export default Upload;
