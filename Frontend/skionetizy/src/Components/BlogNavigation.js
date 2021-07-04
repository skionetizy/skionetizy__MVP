import React, { useState, useEffect } from "react";
import style from "../Pages/exploreBlogs.module.css";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import PaginatedButton from "./PaginatedButton";

function BlogNavigation({ blogsPerPage, blogsLength, setCurrentBlog }) {
  // console.log({ blogsPerPage, blogsLength });
  const buttonsLength = blogsLength / blogsPerPage;
  const buttons = [];
  for (var i = 0; i < buttonsLength; i++) {
    buttons.push(i);
  }
  // console.log({ buttons });

  const currWindow = 5;
  const [leftPointer, setLeftPointer] = useState(0);
  const [rightPointer, setRightPointer] = useState(leftPointer + currWindow);
  const [hasNext, setHasNext] = useState(true);
  const [hasPrev, setHasPrev] = useState(false);
  const initialPaginatedButtons = buttons.slice(leftPointer, rightPointer);

  const [PaginatedButtons, setPaginatedButtons] = useState(
    initialPaginatedButtons
  );

  // console.log({ PaginatedButtons });

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
      <div className={style.pageNum}>
        {hasPrev && (
          <ArrowBackIosIcon className={style.icon} onClick={handlePrev} />
        )}
        {/* <div>1</div> <div>2</div>{" "}
        <div>3</div> <div>4</div> <div>5</div>{" "} */}
        {PaginatedButtons.map((button, index) => {
          return (
            <PaginatedButton
              index={index}
              button={button}
              setCurrentBlog={setCurrentBlog}
            />
          );
        })}
        {hasNext && (
          <ArrowForwardIosIcon className={style.icon} onClick={handleNext} />
        )}
      </div>
    </div>
  );
}

export default BlogNavigation;
