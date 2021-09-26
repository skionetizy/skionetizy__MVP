import { react, useState, useEffect } from "react";
import { connect } from "react-redux";

import useDebounceGeneral from "../hooks/useDebounceGeneral";

import SearchIcon from "@material-ui/icons/Search";
import style from "./searchBar.module.css";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { Redirect } from "react-router-dom";

import { withRouter } from "react-router";

const SearchBar = (props) => {
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
    <div>
      <div className={style.search}>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className={style.searchBar}
            onChange={handleSearchInput}
          />
          <button className={style.submitButton} type="submit">
            <SearchIcon className={style.searchIcon} />
          </button>
        </form>
      </div>
    </div>
  );
};
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
  connect(mapStateToProps, mapDispatchToProps)(SearchBar)
);
