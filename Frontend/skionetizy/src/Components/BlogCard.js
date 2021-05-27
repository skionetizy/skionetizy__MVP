import React from "react";
import { Link } from "react-router-dom";

import "./ExploreBlogs.css";

const BlogCard = ({ blog }) => {
  return (
    <div>
      <Link to={`/view-blog/${blog.blogID}`}>
        <div className="main">
          <div className="card-box">
            <img
              className="blog-cover"
              src="https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt=""
            />
            <div className="text">
              <h3>How to write a blog</h3>
              <div className="author">
                <img className="avatar" src="//unsplash.it/40/40" alt="" />
                <small className="author-name">Rahul gupta</small>
              </div>
              <div>
                <div className="day-likes-dislikes">
                  <h4 class="date">May 4</h4>
                  <p className="push-right">
                    241 <i class="thumb-up-alt material-icons">thumb_up_alt</i>
                  </p>
                  <p>
                    10{" "}
                    <i class="thumb-down-alt material-icons">thumb_down_alt</i>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
