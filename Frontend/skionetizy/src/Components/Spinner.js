import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Spinner(props) {
  return (
    <AiOutlineLoading3Quarters
      style={{
        animation: "spinner 1.75s linear forwards infinite",
      }}
      width="1em"
      fontSize="inherit"
      {...props}
    />
  );
}
