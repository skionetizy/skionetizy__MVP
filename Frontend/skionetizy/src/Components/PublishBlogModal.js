import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import styles from "./PublishBlogModal.module.css";
import useAuth from "../hooks/useAuth";

function PublishBlogModal(props) {
  const auth = useAuth();
  return (
    <Modal {...props}>
      <Modal.Body>
        <Modal.Head>Successful</Modal.Head>

        <div className={styles.modalBody}>
          <p>Blog published to draft for review.</p>
          <Button link to={`/${auth.profile?.profileUserName}`} variant="dark">
            Go to Profile
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default PublishBlogModal;
