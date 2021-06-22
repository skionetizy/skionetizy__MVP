import React from 'react';
// import '../index.css'
import { Link } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import style from '../index.module.css';

function Nav() {
	return (
		<div className={style.container}>
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
		</div>
	);
}

export default Nav;
