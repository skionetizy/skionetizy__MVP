import React from 'react';
// import '../index.css'
import { Link } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import style from '../Components/nav.module.css';

function Nav() {
	return (
		<div className={style.container}>
			<nav className={style.nav}>
				<div className={style.header}>
					<h1 className={style.logo}>Logo</h1>
				</div>
				<input type="checkbox" id="nav-toggle" className={style.navToggle} />
				<label className={style.hamburger} htmlFor="nav-toggle">
					<MenuIcon fontSize="large" className={style.hamburgerIcon} />
				</label>
				<ul className={style.links}>
					<li className={style.link}>
						<Link className={style.navLink} to="#">
							Explore
						</Link>
					</li>
					<li className={style.link}>
						<Link className={style.navLink} to="#">
							About us
						</Link>
					</li>
					<li className={style.link}>
						<Link className={style.navLink} to="#">
							Contact us
						</Link>
					</li>
					<li className={style.link}>
						<Link className={style.navLink} to="#">
							Get Started
						</Link>
					</li>
				</ul>
			</nav>
		</div>
	);
}

export default Nav;
