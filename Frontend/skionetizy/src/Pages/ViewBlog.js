import React from 'react';
import { Link } from 'react-router-dom';
import './ViewBlog.css';

const ViewBlog = () => {
	return (
		<div>
			<div className="main container">
				<nav className="nav">
					<input type="checkbox" id="nav-toggle" className="nav-toggle" />
					<label className="hamburger" htmlFor="nav-toggle">
						<i className="hamburger-icon material-icons">menu</i>
					</label>
					<ul className="links d-flex">
						<Link className="nav_link" href="#">
							<li className="link">About us</li>
						</Link>
						<Link className="nav_link" href="#">
							<li className="link">Contact us</li>
						</Link>
						<Link className="nav_link" href="#">
							<li className="link">Get Started</li>
						</Link>
					</ul>
				</nav>
				<div className="blog-header">
					<h1 className="title">How to write a blog</h1>
					<div className="author">
						<img className="avatar" src="//unsplash.it/50/50" alt="" />
						<small className="author-name">Rahul gupta</small>
					</div>
				</div>
				<div className="blog-area">
					<div className="blog-cover-image">
						<img
							className="blog-image"
							src="https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
							alt=""
						/>
					</div>
					<div className="blog-content">
						<article>
							<p>
								Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia, consequatur deserunt at
								iure magni eaque repudiandae in accusantium voluptatum. Placeat necessitatibus
								blanditiis nisi iusto? Animi fugiat blanditiis, asperiores aperiam natus exercitationem
								quae deserunt doloribus quis rem quibusdam eius repellendus incidunt sint! Porro ea
								cumque, illo vero reiciendis earum molestiae dignissimos nobis voluptates itaque
								recusandae accusantium laboriosam consequuntur sint. Quia natus tempora possimus saepe
								nam non, iure, libero veritatis excepturi nemo placeat? Quaerat cupiditate fugiat
								delectus! Perspiciatis quo facilis eum, quas aut rerum! Assumenda atque sint natus,
								quidem hic laudantium facere quis rem ad magni maiores architecto vitae officiis tempore
								corrupti?
							</p>
							<p>
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit dolore maiores rem quaerat
								libero doloribus fuga magni adipisci excepturi culpa nulla, assumenda dolorem, nobis
								expedita sunt. Error repellat nulla corporis obcaecati, ducimus enim iste, mollitia,
								tempora ullam ad explicabo maiores blanditiis animi quaerat fugiat voluptatem facere?
								Tenetur dolore fugiat accusamus, minus labore rerum in soluta cumque, voluptate corrupti
								sint velit praesentium quis quibusdam. Voluptatibus odio nam ad sapiente nostrum
								nesciunt architecto dolorem dolor porro voluptas modi excepturi, voluptatum,
								reprehenderit culpa, fugit perspiciatis eveniet quasi nulla in aliquam tenetur doloribus
								ea adipisci id. Libero ratione harum officia nulla excepturi labore quae!
							</p>
							<p>
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit dolore maiores rem quaerat
								libero doloribus fuga magni adipisci excepturi culpa nulla, assumenda dolorem, nobis
								expedita sunt. Error repellat nulla corporis obcaecati, ducimus enim iste, mollitia,
								tempora ullam ad explicabo maiores blanditiis animi quaerat fugiat voluptatem facere?
								Tenetur dolore fugiat accusamus, minus labore rerum in soluta cumque, voluptate corrupti
								sint velit praesentium quis quibusdam. Voluptatibus odio nam ad sapiente nostrum
								nesciunt architecto dolorem dolor porro voluptas modi excepturi, voluptatum,
								reprehenderit culpa, fugit perspiciatis eveniet quasi nulla in aliquam tenetur doloribus
								ea adipisci id. Libero ratione harum officia nulla excepturi labore quae!
							</p>
							<p>
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit dolore maiores rem quaerat
								libero doloribus fuga magni adipisci excepturi culpa nulla, assumenda dolorem, nobis
								expedita sunt. Error repellat nulla corporis obcaecati, ducimus enim iste, mollitia,
								tempora ullam ad explicabo maiores blanditiis animi quaerat fugiat voluptatem facere?
								Tenetur dolore fugiat accusamus, minus labore rerum in soluta cumque, voluptate corrupti
								sint velit praesentium quis quibusdam. Voluptatibus odio nam ad sapiente nostrum
								nesciunt architecto dolorem dolor porro voluptas modi excepturi, voluptatum,
								reprehenderit culpa, fugit perspiciatis eveniet quasi nulla in aliquam tenetur doloribus
								ea adipisci id. Libero ratione harum officia nulla excepturi labore quae!
							</p>
						</article>
					</div>
				</div>
				<div className="meta">
					<div className="meta-content">
						<p className="views">
							<i className="view-icon material-icons">visibility</i> 243
						</p>
						<p className="push--right likes">
							241 <i className="thumb-up material-icons">thumb_up</i>
						</p>
						<p className="dislikes">
							100 <i className="thumb-down material-icons">thumb_down</i>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ViewBlog;
