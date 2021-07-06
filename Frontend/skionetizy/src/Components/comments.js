import React from 'react';
import styles from '../Components/comments.module.css';

const Comments = () => {
	return (
		<div>
			<div className={styles.user_comments}>
				<div className={styles.userContents}>
					<img className={styles.user_avatar} src="//unsplash.it/40/40" alt=" " />
					<div className={styles.published}>
						<small className={styles.userName}>Rahul Gupta</small>
					</div>
				</div>
        <div className={styles.comment_text}>
          <p>This is a great post</p>
        </div>
			</div>
		</div>
	);
};

export default Comments;
