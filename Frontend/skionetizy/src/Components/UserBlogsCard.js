import style from './UserProfile.module.css';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';

const UserBlogsCard = () => {
	return (
		<div className={style.container}>
			<div className={style.row}>
				<img
					className={style.blogImage}
					src="https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
					alt=""
				/>
				<div className={style.blogInfo}>
					<div className={style.blogTitle}>How to write a blog</div>
					<div className={style.dayLikesDislikes}>
						<h4 className={style.date}>May 4, 2021</h4>
						<div className={style.pushRight}>
							{/* <span>241</span> */}
							<span>128</span>
							<ThumbUpAltIcon className={style.ThumbUpAlt} />
						</div>
						<div className={style.thumbDown}>
							{/* <span>10</span> */}
							<span>10</span>
							<ThumbDownAltIcon className={style.ThumbDownAlt} />
						</div>
					</div>
					<div className={style.actions}>
						<button className={`${style.deleteBlog} ${style.secondaryButton}`}>Delete</button>
						<button className={style.editBlog}>Edit Blog</button>
					</div>
				</div>
			</div>
			<hr />
		</div>
	);
};

export default UserBlogsCard;
