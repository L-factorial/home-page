import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { FiArrowLeft } from "react-icons/fi";
import Markdown from 'react-markdown';



function Blog() {
    const [blog, setBlog] = useState({})
    const {id, category} = useParams()

    useEffect(() => {
        fetchBlog()
    }, [id])

    const fetchBlog = async () => {
        const blogData = await fetch(`/blogs/${id}`);
        const blogJson = await blogData.json();
        setBlog(blogJson)
    }
    const backArrow = () => {
        return (
            <div>
                <Link to={`/blogListByCategory/${category}`} > <FiArrowLeft/></Link>
            </div>  
        )       
    }
    return (
        <div className="main-content">
            <div className="main-content-blog-container">
            {backArrow()}
                <div className="blog-date">
                    <div> Published : {blog?.data?.attributes?.publishedAt}  </div>
                    <div> Last updated: {blog?.data?.attributes?.updatedAt} </div>
                </div>
                <div className="blog-title">
                    {blog?.data?.attributes?.title}
                </div>
                <div className="main-content-blog">
                    <Markdown>{blog?.data?.attributes?.blocks[0]?.body}</Markdown>
                </div>
            </div>

        </div>
    )
}

export default Blog
