<<<<<<< HEAD
import React from 'react';
import "./ExploreBlogs.css";
import NavExploreBlogs from './NavExploreBlogs';
import BlogCard from './BlogCard';
import BlogPages from './BlogPages';
function MyBlogs() {
    return (
        <div>
            <NavExploreBlogs/>
            <div className="blogcard-main">
            <BlogCard/>
            <BlogCard/>
            <BlogCard/>
            <BlogCard/>
            <BlogCard/>
            <BlogCard/>
            <BlogCard/>
            <BlogCard/>
            <BlogCard/>
            </div>
            <BlogPages/>
            
        </div>
    );
=======
import React from "react";
import "./ExploreBlogs.css";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import SearchIcon from "@material-ui/icons/Search";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
function MyBlogs() {
  return (
    <div>
      {/* NAV SECTION HERE */}
      <header className="header">
        <div className="logo">LOGO</div>
        <div className="searchdiv">
          <SearchIcon className="search" />
          <input type="text" placeholder="Search.." />
        </div>

        <nav className="nav">
          <a href="#">Explore</a>
          <a href="#">ContactUS</a>
          <a href="#">AboutUS</a>
        </nav>
      </header>
      {/* card section is here */}
      <div className="main">
        {/* Card-1 is here  */}
        <div className="card-box">
          <div className="card-image"></div>
          <div className="title">my title is here</div>
          <div className="name">
            <div className="avtar"></div>
            <h3>full name here</h3>
          </div>
          <div className="footer">
            <div className="date">april 2</div>
            <div className="like">
              512 <ThumbUpAltIcon /> 184 <ThumbDownIcon />
            </div>
          </div>
        </div>

        {/* Card-2 is here  */}
        <div className="card-box">
          <div className="card-image"></div>
          <div className="title">MY TITLE IS HERE</div>
          <div className="name">
            <div className="avtar"></div>
            <h3>FULL NAME HERE</h3>
          </div>
          <div className="footer">
            <div className="date">april 2</div>
            <div className="like">
              512 <ThumbUpAltIcon /> 184 <ThumbDownIcon />
            </div>
          </div>
        </div>
        {/* Card-3 is here  */}
        <div className="card-box">
          <div className="card-image"></div>
          <div className="title">MY TITLE IS HERE</div>
          <div className="name">
            <div className="avtar"></div>
            <h3>FULL NAME HERE</h3>
          </div>
          <div className="footer">
            <div className="date">april 2</div>
            <div className="like">
              512 <ThumbUpAltIcon /> 184 <ThumbDownIcon />
            </div>
          </div>
        </div>
        {/* Card-4 is here  */}
        <div className="card-box">
          <div className="card-image"></div>
          <div className="title">MY TITLE IS HERE</div>
          <div className="name">
            <div className="avtar"></div>
            <h3>FULL NAME HERE</h3>
          </div>
          <div className="footer">
            <div className="date">april 2</div>
            <div className="like">
              512 <ThumbUpAltIcon /> 184 <ThumbDownIcon />
            </div>
          </div>
        </div>

        {/* Card-5 is here  */}
        <div className="card-box">
          <div className="card-image"></div>
          <div className="title">MY TITLE IS HERE</div>
          <div className="name">
            <div className="avtar"></div>
            <h3>FULL NAME HERE</h3>
          </div>
          <div className="footer">
            <div className="date">april 2</div>
            <div className="like">
              512 <ThumbUpAltIcon /> 184 <ThumbDownIcon />
            </div>
          </div>
        </div>
        {/* Card-6 is here  */}
        <div className="card-box">
          <div className="card-image"></div>
          <div className="title">MY TITLE IS HERE</div>
          <div className="name">
            <div className="avtar"></div>
            <h3>FULL NAME HERE</h3>
          </div>
          <div className="footer">
            <div className="date">april 2</div>
            <div className="like">
              512 <ThumbUpAltIcon /> 184 <ThumbDownIcon />
            </div>
          </div>
        </div>
        {/* Card-7 is here  */}
        <div className="card-box">
          <div className="card-image"></div>
          <div className="title">MY TITLE IS HERE</div>
          <div className="name">
            <div className="avtar"></div>
            <h3>FULL NAME HERE</h3>
          </div>
          <div className="footer">
            <div className="date">april 2</div>
            <div className="like">
              512 <ThumbUpAltIcon /> 184 <ThumbDownIcon />
            </div>
          </div>
        </div>

        {/* Card-8 is here  */}
        <div className="card-box">
          <div className="card-image"></div>
          <div className="title">MY TITLE IS HERE</div>
          <div className="name">
            <div className="avtar"></div>
            <h3>FULL NAME HERE</h3>
          </div>
          <div className="footer">
            <div className="date">april 2</div>
            <div className="like">
              512 <ThumbUpAltIcon /> 184 <ThumbDownIcon />
            </div>
          </div>
        </div>
        {/* Card-9 is here  */}
        <div className="card-box">
          <div className="card-image"></div>
          <div className="title">MY TITLE IS HERE</div>
          <div className="name">
            <div className="avtar"></div>
            <h3>FULL NAME HERE</h3>
          </div>
          <div className="footer">
            <div className="date">april 2</div>
            <div className="like">
              512 <ThumbUpAltIcon /> 184 <ThumbDownIcon />
            </div>
          </div>
        </div>
      </div>
      <div className="page-num">
        <ArrowBackIosIcon className="icon" /> <div>1</div> <div>2</div>{" "}
        <div>3</div> <div>4</div> <div>5</div>{" "}
        <ArrowForwardIosIcon className="icon" />
      </div>
    </div>
  );
>>>>>>> b0dfa0cddf652308d18b4c047a9c61f896616460
}

export default MyBlogs;
