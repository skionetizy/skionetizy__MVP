import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function EmailVerification() {
  const [status, setStatus] = useState("idle");
  const { token } = useParams();

  function handleVerify() {
    axios
      .patch(`/emailVerification/${token}`)
      .then(() => setStatus("verified"))
      .catch(() => setStatus("failure"));
  }

  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "80vh" }}>
      {status === "verified" ? (
        <p>Verifed</p>
      ) : status === "failure" ? (
        <p>Failure. check console for now</p>
      ) : (
        <button onClick={handleVerify} type="button">
          Verify
        </button>
      )}
    </div>
  );
}
