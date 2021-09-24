import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import Button from "../Components/Button";
import useAsync from "../hooks/useAsync";

export default function EmailVerification() {
  const { token } = useParams();
  const verifyEmail = useAsync();

  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "80vh" }}>
      {verifyEmail.isSuccess ? (
        <p>Verifed</p>
      ) : verifyEmail.isError ? (
        <p>Failure. check console for now</p>
      ) : (
        <Button
          onClick={verifyEmail.run(sendEmailVerification(token))}
          type="button"
          isLoading={verifyEmail.isLoading}
        >
          Verify
        </Button>
      )}
    </div>
  );
}

function sendEmailVerification(token) {
  return axios.patch(`/api/emailVerification/${token}`).then((res) => res.data);
}
