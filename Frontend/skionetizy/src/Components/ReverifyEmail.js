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
      // throw createFlaskError("Enter Email ID")
      console.log("Error: Enter Email ID")
      alert("Error: Enter Email ID")
    } else {

      const res = sendReverifyEmail({ emailID });
      res.then((res) => {
        console.log("Inside res ->", res)
        console.log("Inside res.data.Message ->", res.data.Message)
        if (res.data.Message === 'Already Verified') {
          console.log("You are already verified! Please try logging with your password!")
          alert("You are already verified! Please try logging with your password!")
        } else if (res.data.Message === 'Reverification Mail Sent') {
          console.log("Mail Sent! If you can't find our mail, try finding in spam folder!")
          setShowModal('VERFY_EMAIL')
          setIsMailSent(true)
        }
      }).catch((err) => {
        console.log("Error:->", err.message)
        alert("Seems like you aren't part papersdrop yet! Try singing up! ")
        setShowModal('')
      })
    }

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
