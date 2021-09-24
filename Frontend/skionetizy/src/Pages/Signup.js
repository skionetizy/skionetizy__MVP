import React, { useState } from "react";
import { useHistory } from "react-router";
import SignupForm from "../Components/SignupForm";
import VerifyEmailModal from "../Components/VerifyEmailModal";
import styles from "./Signup.module.css";
import clsx from "../utils/clsx";

export default function Signup() {
  const [showModal, setShowModal] = useState("");
  const history = useHistory();

  return (
    <>
      <div className={clsx(styles.container, "center")}>
        <SignupForm
          onSignup={(_user, error) => {
            // after success ful signup, goto `/details` page
            if (error) return;
            setShowModal("VERIFY_EMAIL");
          }}
        />
      </div>
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
