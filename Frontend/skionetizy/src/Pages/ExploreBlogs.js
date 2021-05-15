import React from 'react';
import "../Components/ExploreBlogs.css";
import NavExploreBlogs from '../Components/NavExploreBlogs';
import BlogCard from '../Components/BlogCard';
import BlogPages from '../Components/BlogPages';
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

export default MyBlogs;
