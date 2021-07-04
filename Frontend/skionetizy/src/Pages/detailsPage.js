import React from 'react';
import style from '../Pages/detailsPage.module.css';
import Vector from '../Assets/bro.svg';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const DetailsPage = () => {
	const handleChange = (e) => {};

	const handleSubmit = (e) => {};

	return (
		<div className={`${style.container} ${style.cover_details}`}>
			<div className={style.coverImage_login}>
				<img src={Vector} alt="" className={style.coverImage_svgLogin} />
			</div>
			<div className={`${style.container} ${style.details}`}>
				<div className={style.header}>
					<h1 className={style.header_heading}>Details</h1>
				</div>
				<div className={style.details_container}>
					<form className={style.details_form}>
						<div className={style.username_bio}>
							<input
								type="name"
								name="username"
								placeholder="Enter your username"
								onChange={handleChange}
								//value={username}
								className={style.username}
								required
							/>
							<textarea
								type="textarea"
								name="bio"
								placeholder="Enter your bio"
								onChange={handleChange}
								//value={bio}
								className={style.bio}
								required
							/>
						</div>
						<div className={style.details_text}>
							<p>Maximum length - 300 characters only</p>
						</div>
						<button className={style.nextButton} type="submit">
							Next <FontAwesomeIcon icon={faSignInAlt} onSubmit={handleSubmit} />
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default DetailsPage;
