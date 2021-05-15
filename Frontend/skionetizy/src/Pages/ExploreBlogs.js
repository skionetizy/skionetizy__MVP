import React from 'react';
import "./ExploreBlogs.css";
import NavExploreBlogs from './NavExploreBlogs';
import BlogCard from './BlogCard';
import BlogPages from './BlogPages';
function MyBlogs() {
    return (
        <div>
            <NavExploreBlogs/>
            <div className="blogcard-main">
            <BlogCard/>
            <BlogCard/>
            <BlogCard/>
            <BlogCard/>
            <BlogCard/>
            <BlogCard/>
            <BlogCard/>
            <BlogCard/>
            <BlogCard/>
            </div>
            <BlogPages/>
            
        </div>
    );
}

export default MyBlogs
