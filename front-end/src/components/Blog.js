import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { FiArrowLeft } from "react-icons/fi";
import Markdown from 'react-markdown';



function Blog({ match }) {
    const [blog, setBlog] = useState({})

    useEffect(() => {
        fetchBlog()
    }, [])

    const fetchBlog = async () => {
        const blogData = await fetch(`/blogs/${match.params.id}`);
        console.log(blogData)
        const blogJson = await blogData.json();
        setBlog(blogJson)
        console.log(blog)
    }
    return (
        <div className="home">
            <div className="blog">
            <div>
                <Link to="/blogCategories"> <FiArrowLeft/></Link>
            </div>
                <div className="blog-date">
                    <div> Published : {blog?.data?.attributes?.publishedAt}  </div>
                    <div> Last updated: {blog?.data?.attributes?.updatedAt} </div>
                </div>
                <div className="blog-content">
                    {/* <Markdown>{blog.content}</Markdown> */}
                    <Markdown>{blog?.data?.attributes?.blocks[0]?.body}</Markdown>

                </div>
            </div>
        </div>
    )
}

export default Blog
