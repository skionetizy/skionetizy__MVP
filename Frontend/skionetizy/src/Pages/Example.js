import React, { useState } from "react";
import Modal from "../Components/Modal";
import styles from "./Example.module.css";

export default function Example() {
  const [showEditModal, setShowEditModal] = useState(true);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  function handleClose() {
    setShowEditModal(false);
  }

  return (
    <div className={styles.wrapper}>
      <button onClick={() => setShowEditModal(true)}>Edit</button>

      {showEditModal && (
        // this class makes it look like page on mobile
        <Modal className={styles.overrideToMobile}>
          <div className={styles.formTitle}>
            <p>Edit</p>
            <button onClick={handleClose}>&times;</button>
          </div>

          <form onSubmit={() => console.log("send to backend")}>
            <input />
          </form>
          <button onClick={handleClose}>Cancel</button>
        </Modal>
      )}

      <button onClick={() => setShowSuccessMessage(true)}>Verify</button>
      {showSuccessMessage && (
        <Modal>
          <p>Thank you for verifying</p>
          <button onClick={() => setShowSuccessMessage(false)}>Close</button>
        </Modal>
      )}
    </div>
  );
}
