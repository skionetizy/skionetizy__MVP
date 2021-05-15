import React from 'react'
import './ExploreBlogs.css'
import SearchIcon from '@material-ui/icons/Search';
function navExploreBlogs() {
    return (
        <div>
            {/* NAV SECTION HERE */}
            <header className="header">
                <div className="logo">LOGO</div>
                <div className="searchdiv"><SearchIcon className="search"/><input type="text" placeholder="Search.." /></div>
                
                <nav className="nav">
                    <a href="#">Explore</a>
                    <a href="#">ContactUS</a>
                    <a href="#">AboutUS</a>
                </nav>
            </header>
        </div>
    )
}

export default navExploreBlogs
