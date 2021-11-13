import axios from "axios";
import React, { useEffect, useState } from "react";
import useMutate from "../hooks/useMutate";
import baseURL from "../utils/baseURL";
import createFlaskError from "../utils/createFlaskError";
import Button from "./Button";

export default function ReverifyEmail({ emailID }) {
  const [isMailSent, setIsMailSent] = useState(false);

  const verifyEmail = useMutate({
    mutateFn: () => {
      console.log("email", emailID)
      if (emailID.length === 0) {
        throw createFlaskError("Enter Email ID in login input");
      }
      return sendReverifyEmail({ emailID });
    },
    onSuccess: () => {
      setIsMailSent(true);
    },
    onFailure: (error) => {
      verifyEmail.reset();
      alert(error.flaskError);
    },
  });

  useEffect(() => {
    if (isMailSent === true) {
      setTimeout(() => {
        setIsMailSent(false);
      }, 6000);
    }
  }, [isMailSent]);

  return (
    <Button onClick={verifyEmail.mutate} disabled={isMailSent}>
      {isMailSent ? "Mail sent..." : "Resend Verify Email"}
    </Button>
  );
}


function sendReverifyEmail(data) {
  console.log("from inside of revirify email", data);

  return axios.post(baseURL + "/auth/reverify", data);
}
