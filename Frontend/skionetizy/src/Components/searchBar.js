import SearchIcon from '@material-ui/icons/Search';
import style from './searchBar.module.css';

const SearchBar = () => {
	return (
		<div>
			<div className={style.search}>
				<input type="text" className={style.searchBar} />
				<SearchIcon className={style.searchIcon} />
			</div>
		</div>
	);
};

export default SearchBar;
