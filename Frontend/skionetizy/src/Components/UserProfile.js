import style from './UserProfile.module.css';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import UserBlogsCard from './UserBlogsCard';

const UserProfile = () => {
	return (
		<div className={style.main}>
			<div className={style.body}>
				<div className={style.profileDetails}>
					<img className={style.coverImage} src="//unsplash.it/700/700" alt="" />
					<img className={style.profileImage} src="//unsplash.it/120/120" alt="" />
				</div>
				<div className={style.container}>
					<div className={style.profileDescription}>
						<div className={style.bioDescription}>
							<div className={style.authorDetails}>
								<h2 className={style.author}>Rajath sharma</h2>
								<a className={style.link} href="#">
									bit.ly/rajathsharma
								</a>
							</div>
							<div className={style.date}>
								<CalendarTodayIcon fontSize="small" />
								<p>June 2019</p>
							</div>
							<div className={style.followCount}>
								<p>
									<span className={style.followingCount}>38</span> Following
								</p>
								<p>
									<span className={style.followersCount}>5</span> Followers
								</p>
							</div>
							<div className={style.bio}>
								<p>
									I am a person who loves to write tech content. I am also a designer who has great
									perspection
								</p>
							</div>
						</div>
						<div className={style.buttons}>
							{/* <button className={`${style.buttons_followButton} ${style.secondaryButton}`}>Follow</button> */}
							<button className={style.buttons_editProfile}>Edit profile</button>
						</div>
					</div>

					<div className={style.divider}>
						<h2>My blogs</h2>
					</div>
					<div className={style.userBlogs}>
						<UserBlogsCard />
						<UserBlogsCard />
						<UserBlogsCard />
						<UserBlogsCard />
						<UserBlogsCard />
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
