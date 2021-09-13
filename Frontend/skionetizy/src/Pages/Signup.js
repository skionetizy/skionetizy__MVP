import React, { useState } from "react";
import { useHistory } from "react-router";
import SignupForm from "../Components/SignupForm";
import VerifyEmailModal from "../Components/VerifyEmailModal";

export default function Signup() {
  const [showModal, setShowModal] = useState("");
  const history = useHistory();

  return (
    <>
      <SignupForm
        onSignup={(_user, error) => {
          // after success ful signup, goto `/details` page
          if (error) return;
          setShowModal("VERIFY_EMAIL");
        }}
      />

      {showModal === "VERIFY_EMAIL" && (
        <VerifyEmailModal
          onClose={() => {
            history.push("/details");
          }}
        />
      )}
    </>
  );
}
