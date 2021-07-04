import React from 'react';
import style from '../Pages/exploreBlogs.module.css';
import SearchIcon from '@material-ui/icons/Search';
import { Link } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
function navExploreBlogs() {
	return (
		<div>
			<header className={style.header}>
				<nav className={`${style.nav} ${style.container}`}>
					<h1 className={style.logo}>Logo</h1>
					<div className={style.search}>
						<input type="text" className={style.searchBar} />
						<SearchIcon className={style.searchIcon}/>
					</div>
					<div className={style.pageLinks}>
					<input type="checkbox" id="nav-toggle" className={style.navToggle} />
					<label htmlFor="nav-toggle" className={style.hamburger}>
						<MenuIcon fontSize="large" className={style.hamburgerIcon} />
					</label>
						<ul className={style.links}>
							<Link to="#" className={style.navLink}>
								<li className={style.link}>Explore</li>
							</Link>
							<Link to="#" className={style.navLink}>
								<li className={style.link}>Contact us</li>
							</Link>
							<Link to="#" className={style.navLink}>
								<li className={style.link}>About us</li>
							</Link>
						</ul>
					</div>
				</nav>
			</header>
		</div>
	);
}

export default navExploreBlogs;
