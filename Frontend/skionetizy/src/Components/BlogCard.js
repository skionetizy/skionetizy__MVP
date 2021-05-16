import React from "react";
import "./ExploreBlogs.css";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";

function blogCard({ blog }) {
  return (
    <div key={blog.blogID}>
      {/* card section is here */}
      <div className="main">
        {/* Card is here  */}
        <div className="card-box">
          <div className="card-image"></div>
          <div className="title">My title here- {blog.blogTitle}</div>
          <div className="name">
            <div className="avtar"></div>
            <h3>Full Name Here</h3>
          </div>
          <div className="footer">
            <div className="date">april 2</div>
            <div className="like">
              <p>512-{blog.likesCount}</p>{" "}
              <ThumbUpAltIcon className="thmbicon" />{" "}
              <p>184-{blog.dislikesCount}</p>{" "}
              <ThumbDownIcon className="thmbicon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default blogCard;
