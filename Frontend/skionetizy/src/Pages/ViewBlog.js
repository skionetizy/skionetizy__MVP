import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import axios from 'axios';
// import moment from "moment";

import baseURL from '../utils/baseURL';
import { getLoggedInUserID } from '../utils/AuthorisationUtils';

import style from './ViewBlog.module.css';
import ThumbUp from '@material-ui/icons/ThumbUp';
import ThumbDown from '@material-ui/icons/ThumbDown';
import MenuIcon from '@material-ui/icons/Menu';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ShareIcon from '@material-ui/icons/Share';

const ViewBlog = () => {
	const { blogID, userID } = useParams();

	const [ blog, setBlog ] = useState({});
	const [ authorName, setAuthorName ] = useState('');
	const [ hasliked, setHasliked ] = useState(false);
	const [ hasDisliked, setHasDisliked ] = useState(false);

	const promise1 = axios.get(`${baseURL}/blog/getBlogByBlogID/${blogID}`);
	const promise2 = axios.get(`${baseURL}/user/getUserDetails/${userID}`);

	console.log({ promise1, promise2 });

	useEffect(() => {
		axios.all([ promise1, promise2 ]).then(
			axios.spread((...responses) => {
				const response1 = responses[0];
				setBlog(response1.data.blog);

				const response2 = responses[1];
				setAuthorName(response2.data.user.firstName);

				// console.log({
				//   response1Data: response1.data,
				//   response2Data: response2.data,
				// });
			})
		);
	}, []);

	const handleLike = () => {
		const loggedInUser = getLoggedInUserID();
		if (hasliked === false && hasDisliked === false) {
			setHasliked((previousHasLiked) => !previousHasLiked);
			axios
				.patch(`${baseURL}/blog/likeOnBlog/${loggedInUser}/${blogID}`)
				.then((res) => {
					console.log(res.data);
					// setHasliked((previousHasLiked) => !previousHasLiked);
					// return true;
				})
				.catch((err) => {
					console.log(err);
					// return false;
				});
		} else if (hasliked === true && hasDisliked === false) {
			setHasliked((previousHasLiked) => !previousHasLiked);
			axios
				.patch(`${baseURL}/blog/removeLikeOnBlog/${loggedInUser}/${blogID}`)
				.then((res) => {
					console.log(res.data);
					// setHasliked((previousHasLiked) => !previousHasLiked);
				})
				.catch((err) => console.log(err));
		} else if (hasliked === false && hasDisliked === true) {
			setHasliked((previousHasLiked) => !previousHasLiked);
			setHasDisliked((previousHasDisliked) => !previousHasDisliked);
			axios
				.patch(`${baseURL}/blog/likeOnBlog/${loggedInUser}/${blogID}`)
				.then((res) => {
					console.log(res.data);
					// setHasliked((previousHasLiked) => !previousHasLiked);
				})
				.catch((err) => console.log(err));
			axios
				.patch(`${baseURL}/blog/removeDislikeOnBlog/${loggedInUser}/${blogID}`)
				.then((res) => {
					console.log(res.data);
					// setHasDisliked((previousHasDisliked) => !previousHasDisliked);
				})
				.catch((err) => console.log(err));
		}
	};

	const handleDislike = () => {
		console.log({ hasDisliked });
		const loggedInUser = getLoggedInUserID();

		if (hasDisliked === false && hasliked === false) {
			setHasDisliked((previousHasDisliked) => !previousHasDisliked);
			axios
				.patch(`${baseURL}/blog/dislikeOnBlog/${loggedInUser}/${blogID}`)
				.then((res) => {
					console.log(res.data);
					// setHasDisliked((previousHasDisliked) => !previousHasDisliked);
				})
				.catch((err) => console.log(err));
		} else if (hasDisliked === true && hasliked === false) {
			setHasDisliked((previousHasDisliked) => !previousHasDisliked);
			axios
				.patch(`${baseURL}/blog/removeDislikeOnBlog/${loggedInUser}/${blogID}`)
				.then((res) => {
					console.log(res.data);
					// setHasDisliked((previousHasDisliked) => !previousHasDisliked);
				})
				.catch((err) => console.log(err));
		} else if (hasDisliked === false && hasliked === true) {
			setHasDisliked((previousHasDisliked) => !previousHasDisliked);
			setHasliked((previousHasLiked) => !previousHasLiked);
			axios
				.patch(`${baseURL}/blog/dislikeOnBlog/${loggedInUser}/${blogID}`)
				.then((res) => {
					console.log(res.data);
					// setHasDisliked((previousHasDisliked) => !previousHasDisliked);
				})
				.catch((err) => console.log(err));
			axios
				.patch(`${baseURL}/blog/removeLikeOnBlog/${loggedInUser}/${blogID}`)
				.then((res) => {
					console.log(res.data);
					// setHasliked((previousHasLiked) => !previousHasLiked);
				})
				.catch((err) => console.log(err));
		}
	};

	return (
		<div className={`${style.main} ${style.container}`}>
			<nav className={style.nav}>
				<input type="checkbox" id="nav-toggle" className={style.navToggle} />
				<label className={style.hamburger} htmlFor="nav-toggle">
					<MenuIcon fontSize="large" className={style.hamburgerIcon} />
				</label>
				<ul className={`${style.links} ${style.flex}`}>
					<Link className={style.navLink} to="#">
						<li className={style.link}>About us</li>
					</Link>
					<Link className={style.navLink} to="#">
						<li className={style.link}>Contact us</li>
					</Link>
					<Link className={style.navLink} to="#">
						<li className={style.link}>Get Started</li>
					</Link>
				</ul>
			</nav>
			<div className={style.blogHeader}>
				{/* <h1 className={style.title}>How to write a blog</h1> */}
				<h1 className={style.title}>{blog.blogTitle}</h1>
				<div className={style.author}>
					<img className={style.avatar} src="//unsplash.it/50/50" alt=" " />
					{/* <small className={style.authorName}>Rahul gupta</small> */}
					<div className={style.published}>
						<small className={style.authorName}>Rahul gupta</small>
						<small className={style.publishedDate}>
							Published on <small>May 29, 2022</small>
						</small>
					</div>
				</div>
				<div className={style.buttons}>
					<button className={`${style.button} ${style.followButton}`}>Follow</button>
					<button className={`${style.button} ${style.shareButton}`}>
						Share <ShareIcon fontSize="small" />
					</button>
				</div>
			</div>
			<div className={style.blogArea}>
				<div className={style.blogCoverImage}>
					{/* <img
            className={style.blogImage}
            src="https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            alt=" "
          /> */}
					<img className={style.blogImage} src={`${blog.blogImageURL}`} alt=" " />
				</div>
				<div className={style.blogContent}>
					<article>
						{/* <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia,
              consequatur deserunt at iure magni eaque repudiandae in
              accusantium voluptatum. Placeat necessitatibus blanditiis nisi
              iusto? Animi fugiat blanditiis, asperiores aperiam natus
              exercitationem quae deserunt doloribus quis rem quibusdam eius
              repellendus incidunt sint! Porro ea cumque, illo vero reiciendis
              earum molestiae dignissimos nobis voluptates itaque recusandae
              accusantium laboriosam consequuntur sint. Quia natus tempora
              possimus saepe nam non, iure, libero veritatis excepturi nemo
              placeat? Quaerat cupiditate fugiat delectus! Perspiciatis quo
              facilis eum, quas aut rerum! Assumenda atque sint natus, quidem
              hic laudantium facere quis rem ad magni maiores architecto vitae
              officiis tempore corrupti?
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit
              dolore maiores rem quaerat libero doloribus fuga magni adipisci
              excepturi culpa nulla, assumenda dolorem, nobis expedita sunt.
              Error repellat nulla corporis obcaecati, ducimus enim iste,
              mollitia, tempora ullam ad explicabo maiores blanditiis animi
              quaerat fugiat voluptatem facere? Tenetur dolore fugiat accusamus,
              minus labore rerum in soluta cumque, voluptate corrupti sint velit
              praesentium quis quibusdam. Voluptatibus odio nam ad sapiente
              nostrum nesciunt architecto dolorem dolor porro voluptas modi
              excepturi, voluptatum, reprehenderit culpa, fugit perspiciatis
              eveniet quasi nulla in aliquam tenetur doloribus ea adipisci id.
              Libero ratione harum officia nulla excepturi labore quae!
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit
              dolore maiores rem quaerat libero doloribus fuga magni adipisci
              excepturi culpa nulla, assumenda dolorem, nobis expedita sunt.
              Error repellat nulla corporis obcaecati, ducimus enim iste,
              mollitia, tempora ullam ad explicabo maiores blanditiis animi
              quaerat fugiat voluptatem facere? Tenetur dolore fugiat accusamus,
              minus labore rerum in soluta cumque, voluptate corrupti sint velit
              praesentium quis quibusdam. Voluptatibus odio nam ad sapiente
              nostrum nesciunt architecto dolorem dolor porro voluptas modi
              excepturi, voluptatum, reprehenderit culpa, fugit perspiciatis
              eveniet quasi nulla in aliquam tenetur doloribus ea adipisci id.
              Libero ratione harum officia nulla excepturi labore quae!
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit
              dolore maiores rem quaerat libero doloribus fuga magni adipisci
              excepturi culpa nulla, assumenda dolorem, nobis expedita sunt.
              Error repellat nulla corporis obcaecati, ducimus enim iste,
              mollitia, tempora ullam ad explicabo maiores blanditiis animi
              quaerat fugiat voluptatem facere? Tenetur dolore fugiat accusamus,
              minus labore rerum in soluta cumque, voluptate corrupti sint velit
              praesentium quis quibusdam. Voluptatibus odio nam ad sapiente
              nostrum nesciunt architecto dolorem dolor porro voluptas modi
              excepturi, voluptatum, reprehenderit culpa, fugit perspiciatis
              eveniet quasi nulla in aliquam tenetur doloribus ea adipisci id.
              Libero ratione harum officia nulla excepturi labore quae!
            </p> */}
						{blog.blogDescription}
					</article>
				</div>
			</div>
			<div className={style.meta}>
				<div className={style.metaContent}>
					<div className={style.views}>
						<span>250 </span>
						{/* <span>{blog.views}</span>{" "}  this vairable is not yet defined, dont uncomment it*/}
						<VisibilityIcon fontSize="large" className={style.viewIcon} />
					</div>
					<div className={`${style.pushRight} ${style.likes}`}>
						{/* <span>241</span>{" "} */}
						<span onClick={handleLike}>{blog.likesCount}</span>
						{/* use the above state of hasLiked and add the css or remove the css on the like button*/}
						<ThumbUp fontSize="large" className={style.thumbUp} />
					</div>
					<div className={style.dislikes}>
						{/* <span>100</span>{" "} */}
						<span onClick={handleDislike}>{blog.dislikesCount}</span>
						{/* use the above state of hasDisliked and add the css or remove the css on the dislike button*/}
						<ThumbDown fontSize="large" className={style.thumbDown} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default ViewBlog;
