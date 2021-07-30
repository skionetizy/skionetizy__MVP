import React from "react";

export default function FormInput({ label, error, ...props }) {
  return (
    <div>
      <label htmlFor={props.name}>{label}</label>
      {/* by default name is id */}
      {/* can be over written by props */}
      <input id={props.name} {...props} />
      {error && <p>{error}</p>}
    </div>
  );
}
