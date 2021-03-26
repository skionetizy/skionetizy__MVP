import React, { useState } from "react";
import "./marDown.css";
import ReactMarkdown from "react-markdown";
function MarkDown() {
  const [input, setInput] = useState("");
  return (
    <div className="mainmark">
      <div style={{ position: "absolute", left: "5%", top: "14%" }}>
        <p>Enter document name</p>
        <br />
        <input
          style={{
            backgroundColor: "#3498db",
            color: "white",
            padding: "5px",
            border: "1px solid transparent",
            outline: "none",
            borderRadius: "5px",
            width: "110%",
          }}
        />
      </div>
      <textarea
        autoFocus
        rows="40"
        cols="85"
        className="textarea"
        fixed
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
      <ReactMarkdown source={input} className="markdown" />
    </div>
  );
}

export default MarkDown;
