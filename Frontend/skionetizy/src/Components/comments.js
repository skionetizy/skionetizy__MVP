import React from "react";
import styles from "../Components/comments.module.css";
import DeleteIcon from "@material-ui/icons/Delete";
import { deleteCommentAPIHandler } from "../API/blogAPIHandler";

import { getBlogIDUtil } from "../utils/blogUtil";
import { useParams } from "react-router-dom";

const Comments = ({
  comment,
  updateCommentStatusMessage,
  // default to no-operation function to prevent error: TypeError: onDelete is not a function
  onDelete = () => {},
}) => {
  // const { comment } = commentFromBlog;
  //   console.log({ blogIDfromComments: blogID });
  const { blogID } = useParams();
  console.log(comment, blogID);

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
  return (
    <div>
      <div className={styles.user_comments}>
        <div className={styles.userContents}>
          <img
            className={styles.user_avatar}
            src="//unsplash.it/40/40" //edit it with profile
            alt=" "
          />
          <div className={styles.published}>
            <small className={styles.userName}>Rahul Gupta</small>
          </div>
        </div>
        <div className={styles.comment_text}>
          <p>{comment.commentDescription}</p>
          <button className={styles.comment_delete} onClick={handleDelete}>
            <DeleteIcon />
          </button>
        </div>
      </div>
      <hr className={styles.break} />
    </div>
  );
};

export default Comments;
