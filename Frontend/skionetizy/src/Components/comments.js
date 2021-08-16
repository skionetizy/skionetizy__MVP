import React, { useState } from "react";
import styles from "../Components/comments.module.css";
import DeleteIcon from "@material-ui/icons/Delete";
import { deleteCommentAPIHandler } from "../API/blogAPIHandler";

import { useParams } from "react-router-dom";
import { getLoggedInProfileID } from "../utils/AuthorisationUtils";

const Comments = ({
  comment,
  updateCommentStatusMessage,
  // default to no-operation function to prevent error: TypeError: onDelete is not a function
  onDelete = () => {},
  authorProfileID,
}) => {
  const { blogID } = useParams();
  console.log(comment, blogID);
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = (e) => {
    deleteCommentAPIHandler({
      comment,
      blogID,
    })
      .then((res) => {
        console.log(res.data);
        updateCommentStatusMessage(res.data.message);
        onDelete(res);
      })
      .catch((err) => console.log(err));
  };

  const handleShowDelete = () => {
    if (
      comment.profileID == getLoggedInProfileID() ||
      getLoggedInProfileID() == authorProfileID
    ) {
      setShowDelete(true);
    } else {
      setShowDelete(false);
    }
  };
  return (
    <div>
      <div className={styles.user_comments}>
        <div className={styles.userContents}>
          <img
            className={styles.user_avatar}
            // src="//unsplash.it/40/40" //edit it with profile
            src={comment.profilePicImageURL} //edit it with profile
            alt=" "
          />
          <div className={styles.published}>
            {/* <small className={styles.userName}>Rahul Gupta</small> */}
            <small className={styles.userName}>{comment.profileName}</small>
          </div>
        </div>
        <div className={styles.comment_text}>
          <p>{comment.commentDescription}</p>
          {handleShowDelete() && (
            <button className={styles.comment_delete} onClick={handleDelete}>
              <DeleteIcon />
            </button>
          )}
        </div>
      </div>
      <hr className={styles.break} />
    </div>
  );
};

export default Comments;
