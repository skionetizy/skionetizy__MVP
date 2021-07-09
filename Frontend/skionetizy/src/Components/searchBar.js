import { react, useState, useEffect } from "react";
import { connect } from "react-redux";

import useDebounce from "../hooks/useDebounce";

import SearchIcon from "@material-ui/icons/Search";
import style from "./searchBar.module.css";
import { faBook } from "@fortawesome/free-solid-svg-icons";

const SearchBar = (props) => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState("");

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  const debouncedSearch = useDebounce(searchInput, 2000);

  useEffect(() => {
    if (debouncedSearch) {
      const loweredDebounceSearch = debouncedSearch.toLowerCase();
      const filteredData = props.slicedBlogs((blog) => {
        return (
          blog.blogTitle.toLowerCase().includes(loweredDebounceSearch) ||
          blog.blogDescription
            .substring(0, 100)
            .toLowerCase()
            .includes(loweredDebounceSearch)
        );
      });
    }
  }, [debouncedSearch]);

  return (
    <div>
      <div className={style.search}>
        <input
          type="text"
          className={style.searchBar}
          onChange={handleSearchInput}
        />
        <SearchIcon className={style.searchIcon} />
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    slicedBlogs: state.slicedBlogs,
  };
};
export default connect(mapStateToProps)(SearchBar);
