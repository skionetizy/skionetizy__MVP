import React, { useState, useEffect } from "react";
import "./ExploreBlogs.css";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

function BlogNavigation({ blogsPerPage, blogsLength, setCurrentBlog }) {
  const buttonsLength = blogsLength / blogsPerPage;
  const buttons = [];
  for (var i = 0; i < buttonsLength; i++) {
    buttons.push(i);
  }

  const currWindow = 5;
  const [leftPointer, setLeftPointer] = useState(0);
  const [rightPointer, setRightPointer] = useState(leftPointer + currWindow);
  const [hasNext, setHasNext] = useState(true);
  const [hasPrev, setHasPrev] = useState(false);
  const initialPaginatedButtons = buttons.slice(leftPointer, rightPointer);

  const [PaginatedButtons, setPaginatedButtons] = useState(buttons.slice(0, 5));

  const handlePaginatedButtons = () => {
    if (rightPointer < buttonsLength) {
      setHasNext(true);
    } else {
      setHasNext(false);
    }
    if (leftPointer <= 0) {
      setHasPrev(false);
    } else {
      setHasPrev(true);
    }
  };

  const handlePrev = () => {
    setLeftPointer((prevLeftPointer) => prevLeftPointer - 1);
    setRightPointer((prevRightPointer) => prevRightPointer - 1);
    setPaginatedButtons(buttons.slice(leftPointer, rightPointer));
    handlePaginatedButtons();
  };

  const handleNext = () => {
    setLeftPointer((prevLeftPointer) => prevLeftPointer + 1);
    setRightPointer((prevRightPointer) => prevRightPointer + 1);
    setPaginatedButtons(buttons.slice(leftPointer, rightPointer));
    // console.log("clicked next");
    handlePaginatedButtons();
  };

  return (
    <div>
      <div className="page-num">
        {hasPrev && <ArrowBackIosIcon className="icon" onClick={handlePrev} />}
        {/* <div>1</div> <div>2</div>{" "}
        <div>3</div> <div>4</div> <div>5</div>{" "} */}
        {PaginatedButtons.map((button, index) => {
          return (
            <a
              key={index}
              style={{ margin: "10px" }}
              onClick={() => setCurrentBlog(button)}
            >
              {button + 1}
            </a>
          );
        })}
        {hasNext && (
          <ArrowForwardIosIcon className="icon" onClick={handleNext} />
        )}
      </div>
    </div>
  );
}

export default BlogNavigation;
