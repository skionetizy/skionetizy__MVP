import React from 'react';
import style from '../Pages/searchPage.module.css';

const SearchBlogCard = () => {
	return (
		<div>
			<div>
				<div className={style.blog_container}>
					<img className={style.blog_image} src="//unsplash.it/500/500" alt="" />
					<div className={style.main}>
						<div className={style.blog_info}>
							<h3>How to write a blog</h3>
							<h5>May 9</h5>
						</div>
						<div className={style.userContents_container}>
							<div className={style.userContents}>
								<img className={style.user_avatar} src="//unsplash.it/40/40" alt=" " />
								<div className={style.published}>
									<small className={style.userName}>Rahul Gupta</small>
								</div>
							</div>
							<div className={style.blog_content}>
								<p>
									Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos veritatis
									delectus, quibusdam fuga quo expedita suscipit cupiditate nulla sint fugit.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}; 

export default SearchBlogCard;