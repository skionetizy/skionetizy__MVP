import axios from "axios";
import React, { useEffect, useState } from "react";
import useMutate from "../hooks/useMutate";
import baseURL from "../utils/baseURL";
import createFlaskError from "../utils/createFlaskError";
import Button from "./Button";
import VerifyEmailModal from "../Components/VerifyEmailModal";

export default function ReverifyEmail({ emailID }) {
  const [isMailSent, setIsMailSent] = useState(false);
  const [showModal, setShowModal] = useState('');

  // const verifyEmail = useMutate({
  //   mutateFn: () => {
  //     console.log("email", emailID)
  //     if (emailID.length === 0) {
  //       throw createFlaskError("Enter Email ID in login input");
  //     }
  //     setShowModal('VERFY_EMAIL')
  //     return sendReverifyEmail({ emailID });
  //   },
  //   onSuccess: () => {
  //     setIsMailSent(true);
  //   },
  //   onFailure: (error) => {
  //     verifyEmail.reset();
  //     alert(error.flaskError);
  //   },
  // });

  const handleVerifyEmail = (e) => {
    e.preventDefault()
    console.log("Inside handleVerifyEmail")
    console.log("email", emailID)
    if (emailID.length === 0) {
      throw createFlaskError("Enter Email ID")
    }
    setShowModal('VERFY_EMAIL')
    const res = sendReverifyEmail({ emailID });
    console.log("Inside handleVerifyEmail -> res->", res)
  }

  useEffect(() => {
    if (isMailSent === true) {
      setTimeout(() => {
        setIsMailSent(false);
      }, 6000);
    }
  }, [isMailSent]);

  return (
    <>
      {/* <Button onClick={verifyEmail.mutate} disabled={isMailSent}> */}
      <Button onClick={handleVerifyEmail} disabled={isMailSent}>
        {isMailSent ? "Mail sent..." : "Resend Verify Email"}
      </Button>
      {
        showModal === 'VERFY_EMAIL' && (
          <VerifyEmailModal onClose={() => setShowModal('')} />
        )
      }
    </>



  );
}


function sendReverifyEmail(data) {
  console.log("from inside of revirify email", data);
  return axios.post(baseURL + "/auth/reverify", data);
}
