import React from 'react';
import { Link } from 'react-router-dom';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';

import style from './exploreBlogs.module.css';

const BlogCard = ({ blog }) => {
	return (
		<div>
			{/* <Link to = {`/view-blog/ ${blog.blogID}`}> */}
			<div className={style.main}>
				<div className={style.cardBox}>
					<img
						className={style.blogCover}
						src="https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
						alt=""
					/>
					<div className={style.blogDetails}>
						<div className={style.text}>
							<div className={style.title}>
								<h3>How to write a blog</h3>
							</div>
							<div className={style.author}>
								<img className={style.avatar} src="//unsplash.it/40/40" alt="" />
								<small className={style.authorName}>Rahul gupta</small>
							</div>
							<div>
								<div className={style.dayLikesDislikes}>
									<h4 class={style.date}>May 4</h4>
									<div className={style.pushRight}>
										<span>241</span> 
                    <ThumbUpAltIcon className={style.ThumbUpAlt} />
									</div>
									<div className={style.thumbDown}>
										<span>10</span> 
                    <ThumbDownAltIcon className={style.ThumbDownAlt} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* </Link> */}
		</div>
	);
};

export default BlogCard;
