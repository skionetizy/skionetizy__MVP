import React, { useEffect, useState } from "react";
import { FaBars, FaSearch } from "react-icons/fa";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import LogoIcon from "../Assets/logo.svg";
import useAuth from "../hooks/useAuth";
import useDebounceGeneral from "../hooks/useDebounceGeneral";
import clsx from "../utils/clsx";
import styles from "./NavMenuBar.module.css";
import ProfileDropdown from "./ProfileDropdown";

function NavMenuBar(props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { isLoggedIn } = useAuth();

  const [searchInput, setSearchInput] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState("");

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("in handle search submit");
    console.log({ filteredBlogsInHS: filteredBlogs });

    props.saveFilteredBlogs(filteredBlogs);
    // return <Redirect to="/searchpage" />;
    props.history.push(`/searchpage/${searchInput}`);
  };

  const debouncedSearch = useDebounceGeneral(searchInput, 2000);
  console.log({ debouncedSearchAfterUseDebounceGeneral: debouncedSearch });

  useEffect(() => {
    if (debouncedSearch) {
      const loweredDebounceSearch = debouncedSearch.toLowerCase();
      const slicedBlogs = props.slicedBlogs;
      console.log({ slicedBlogsInUE: slicedBlogs });
      const filteredData = slicedBlogs.filter((blog) => {
        return (
          blog.blogTitle.toLowerCase().includes(loweredDebounceSearch) ||
          blog.blogDescription
            .substring(0, 100)
            .toLowerCase()
            .includes(loweredDebounceSearch)
        );
      });
      console.log({ filteredBlogsInUE: filteredData });
      setFilteredBlogs(filteredData);
    }
  }, [debouncedSearch]);

  return (
    <>
      <header className={styles.header}>
        <button
          className={styles.hamburger}
          onClick={() => setIsMenuOpen((p) => !p)}
        >
          <FaBars />
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
          <input onChange={handleSearchInput} />
          <button type="submit">
            <FaSearch />
          </button>
        </form>

        <ProfileDropdown />
      </header>

      <nav
        className={clsx(
          styles.nav,
          isMenuOpen ? styles.navOpen : styles.navClose
        )}
      >
        <ul className={styles.links}>
          <li>
            <Link className={styles.link} to="/">
              Read Blogs
            </Link>
          </li>
          <li>
            <Link
              className={styles.link}
              to={isLoggedIn ? "/addBlogDetailsMarkdown" : "/login"}
            >
              Add Blog
            </Link>
          </li>
          <li>
            <a
              className={styles.link}
              href="http://skionetizy-staging.herokuapp.com/"
            >
              About Us
            </a>
          </li>
          <li>
            <a
              className={styles.link}
              href="http://skionetizy-staging.herokuapp.com/#mission"
            >
              Mission
            </a>
          </li>
          <li>
            <a
              className={clsx(styles.link, styles.linkHighlight)}
              href="http://skionetizy-staging.herokuapp.com/contact-us"
            >
              Support
            </a>
          </li>
        </ul>

        {!isLoggedIn && (
          <Link className={clsx(styles.link, styles.rightItem)} to="/login">
            Login
          </Link>
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
      dispatch({ type: "SAVE_FILTERED_BLOGS", payload: filteredBlogs }),
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NavMenuBar)
);
