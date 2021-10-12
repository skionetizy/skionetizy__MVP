import React, {useEffect, useState} from "react";
import {FaBars, FaSearch} from "react-icons/fa";
import {connect, useDispatch} from "react-redux";
import {Link, NavLink, withRouter} from "react-router-dom";
import LogoIcon from "../Assets/logo-new.svg";
import useAuth from "../hooks/useAuth";
import useDebounceGeneral from "../hooks/useDebounceGeneral";
import clsx from "../utils/clsx";
import styles from "./NavMenuBar.module.css";
import DonateButton from "../Components/DonateButton";
import ProfileDropdown from "./ProfileDropdown";

function NavMenuBar(props) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const {isLoggedIn} = useAuth();

    const [searchInput, setSearchInput] = useState("");
    const [filteredBlogs, setFilteredBlogs] = useState("");
    const dispatch = useDispatch();

    const handleSearchInput = (e) => {
        setSearchInput(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        props.saveFilteredBlogs(filteredBlogs);
        // return <Redirect to="/searchpage" />;
        props.history.push(`/searchpage/${searchInput}`);
    };

    const debouncedSearch = useDebounceGeneral(searchInput, 2000);

    useEffect(() => {
        if (debouncedSearch) {
            const loweredDebounceSearch = debouncedSearch.toLowerCase();
            const slicedBlogs = props.slicedBlogs;
            console.log({slicedBlogsInUE: slicedBlogs});
            const filteredData = slicedBlogs.filter((blog) => {
                return (
                    blog.blogTitle.toLowerCase().includes(loweredDebounceSearch) ||
                    blog.blogDescription
                        .substring(0, 100)
                        .toLowerCase()
                        .includes(loweredDebounceSearch)
                );
            });
            console.log({filteredBlogsInUE: filteredData});
            setFilteredBlogs(filteredData);
        }
    }, [debouncedSearch]);

    return (
        <>
            <div className={styles.grid}>
                <button
                    className={styles.hamburger}
                    onClick={() => setIsMenuOpen((p) => !p)}
                >
                    <FaBars/>
                </button>

                <Link className={styles.logoLink} to="/">
                    <img
                        src={LogoIcon}
                        alt="fountain pen with tip as hotspot"
                        width="64"
                        height="64"
                    />
                    <p className={styles.headerTitle}>Skionetizy</p>
                </Link>

                <form className={styles.inputContainer} onSubmit={handleSearchSubmit}>
                    <input onChange={handleSearchInput}/>
                    <button type="submit">
                        <FaSearch/>
                    </button>
                </form>

                <div className={styles.profile}>
                    <ProfileDropdown/>
                </div>
            </div>

            <nav
                className={clsx(
                    styles.nav,
                    isMenuOpen ? styles.navOpen : styles.navClose
                )}
            >
                <div></div>

                <ul className={styles.links}>
                    <li>
                        <NavLink
                            exact
                            activeClassName={styles.linkHighlight}
                            className={styles.link}
                            to="/"
                        >
                            Read Blogs
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            activeClassName={styles.linkHighlight}
                            className={styles.link}
                            to={isLoggedIn ? "/addBlogDetailsMarkdown" : "/login"}
                            onClick={() => {
                                dispatch({type: "MARKDOWN_MODE", payload: "add"});
                            }}
                        >
                            Add Blog
                        </NavLink>
                    </li>
                    <li>
                        <Link className={styles.link} to="/landing">
                            About Us
                        </Link>
                    </li>
                    <li>
                        {/*<a*/}
                        {/*  className={styles.link}*/}
                        {/*  href="http://skionetizy-staging.herokuapp.com/#mission"*/}
                        {/*  target="_blank"*/}
                        {/*  rel="noreferrer noopener"*/}
                        {/*>*/}
                        {/*  Mission*/}
                        {/*</a>*/}
                        <Link to={"/mission"} className={styles.link}>Mission</Link>
                    </li>
                    <li>
                        <DonateButton>Support Us</DonateButton>
                    </li>
                </ul>

                {!isLoggedIn && (
                    <NavLink
                        activeClassName={styles.linkHighlight}
                        className={clsx(styles.link, styles.rightItem, styles.loginBtn)}
                        to="/login"
                    >
                        Login
                    </NavLink>
                )}
            </nav>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        slicedBlogs: state.slicedBlogs,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        saveFilteredBlogs: (filteredBlogs) =>
            dispatch({type: "SAVE_FILTERED_BLOGS", payload: filteredBlogs}),
    };
};
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(NavMenuBar)
);
