import React from 'react';
import SearchBlogCard from '../Components/searchBlogCard';
import style from './searchPage.module.css';

const SearchPage = () => {
  return ( 
    <div>
      <div className={style.container}>
        <div className={style.result_count}>
          <h3><span>5 </span>results found</h3>
        </div>
        <div>
          <SearchBlogCard />
        </div>
      </div>
    </div>
   );
}
 
export default SearchPage;