import React from "react";
import { Link } from "react-router-dom";
import { Center } from "../Components/Layouts";

export default function UserNotFound() {
  return (
    <Center style={{ minHeight: "70vh", color: "white" }}>
      <main>
        <h1>404. Not Found</h1>
        <Link style={{ color: "inherit" }} to="/">
          go home
        </Link>
      </main>
    </Center>
  );
}
