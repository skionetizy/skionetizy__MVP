import React, { useState } from "react";
import styles from "./BlogChangeStatusModal.module.css";
import BlogStatusBadge from "./BlogStatusBadge";
import Button from "./Button";
import Modal from "./Modal";

export default function BlogChangeStatusModal({ currentStatus, onClose }) {
  const [blogStatus, setBlogStatus] = useState(currentStatus);

  return (
    <Modal>
      <Modal.Body>
        <Modal.Head onClose={onClose}>Status of the Blog</Modal.Head>

        <div className={styles.statusBadgesGroup}>
          <button
            style={{ border: "none", background: "none" }}
            onClick={() => {
              setBlogStatus("PUBLISHED");
            }}
          >
            <BlogStatusBadge
              className={blogStatus === "PUBLISHED" && styles.activeBlogStatus}
              variant="published"
            >
              published
            </BlogStatusBadge>
          </button>
          <button
            style={{ border: "none", background: "none" }}
            onClick={() => {
              setBlogStatus("CANCELLED");
            }}
          >
            <BlogStatusBadge
              className={blogStatus === "CANCELLED" && styles.activeBlogStatus}
              variant="cancelled"
            >
              cancelled
            </BlogStatusBadge>
          </button>
          <button
            style={{ border: "none", background: "none" }}
            onClick={() => {
              setBlogStatus("IN_REVIEW");
            }}
          >
            <BlogStatusBadge
              className={blogStatus === "IN_REVIEW" && styles.activeBlogStatus}
              variant="in_review"
            >
              in_review
            </BlogStatusBadge>
          </button>
          <button
            style={{ border: "none", background: "none" }}
            onClick={() => {
              setBlogStatus("DRAFT");
            }}
          >
            <BlogStatusBadge
              className={blogStatus === "DRAFT" && styles.activeBlogStatus}
              variant="draft"
            >
              draft
            </BlogStatusBadge>
          </button>
          <button
            style={{ border: "none", background: "none" }}
            onClick={() => {
              setBlogStatus("MODERATOR_MODIFYING");
            }}
          >
            <BlogStatusBadge
              className={
                blogStatus === "MODERATOR_MODIFYING" && styles.activeBlogStatus
              }
              variant="moderator_modifying"
            >
              moderator_modifying
            </BlogStatusBadge>
          </button>
        </div>

        <p className={styles.label}>Comment</p>
        <textarea className={styles.textarea}></textarea>

        <p className={styles.actions}>
          <Button variant="dark" size="small">
            Save
          </Button>
        </p>
      </Modal.Body>
    </Modal>
  );
}
