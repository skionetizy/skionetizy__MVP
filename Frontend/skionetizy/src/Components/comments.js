import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { deleteCommentAPIHandler } from "../API/blogAPIHandler";
import styles from "../Components/comments.module.css";
import useAuth from "../hooks/useAuth";

const Comments = ({
  comment,
  updateCommentStatusMessage,
  // default to no-operation function to prevent error: TypeError: onDelete is not a function
  onDelete = () => {},
  authorProfileID,
}) => {
  const { blogID } = useParams();
  console.log(comment, blogID);
  const auth = useAuth();

  const handleDelete = () => {
    deleteCommentAPIHandler({
      commentID: comment.commentID,
      blogID,
      profileID: auth.profile?.profileID,
    })
      .then((res) => {
        console.log(res.data);
        updateCommentStatusMessage(res.data.message);
        onDelete(res);
      })
      .catch((err) => console.log(err));
  };

  const showDelete =
    comment.profileID == auth.profile?.profileID ||
    auth.profile?.profileID == authorProfileID;

  return (
    <div>
      <div className={styles.user_comments}>
        <div className={styles.userContents}>
          <Link to={"/" + comment.profileUserName}>
            <img
              className={styles.user_avatar}
              // src="//unsplash.it/40/40" //edit it with profile
              src={comment.profilePicImageURL} //edit it with profile
              alt=" "
            />
          </Link>
        </div>

        <div className={styles.comment_text}>
          <small className={styles.userName}>
            <Link to={"/" + comment.profileUserName} style={{color: "inherit", textDecoration: "none"}}>
              {comment.profileName}{" "}
            </Link>
            <span className={styles.date}>
              {comment.timestamp.$date
                ? timestampToDateString(comment.timestamp.$date)
                : ""}
            </span>
          </small>

          <p>{comment.commentDescription}</p>
        </div>

        {showDelete && (
          <button className={styles.comment_delete} onClick={handleDelete}>
            <DeleteIcon />
          </button>
        )}
      </div>
      <hr className={styles.break} />
    </div>
  );
};

function timestampToDateString(timestamp) {
  return new Date(timestamp).toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
  });
}

export default Comments;
