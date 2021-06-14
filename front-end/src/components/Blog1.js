import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Card, CardDeck} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import blogImg from '../blogImg.png'



function Blog1({ match }) {
    const [blog, setBlog] = useState({})

    useEffect(() => {
        fetchBlog()
    }, [])

    const fetchBlog =  async () => {
        const blogData = await fetch(`/blogs/${match.params.id}`);
        console.log(blogData)
        const blogJson = await blogData.json();
        setBlog(blogJson)
        console.log(blog)
    }
    return (
        <div className="home">
            <div className="blog-box">
                <div className="blog-box-title">
                    <h3>{blog.tittle}</h3>
                </div>
                <div classNme="blog-box-date-info">
                        <div><h10>{blog.published_at}</h10></div>
                        <div><h10>{blog.updated_at}</h10></div>
                </div>
                
                <div className="blog-box-main-content">
                    <p>
                        {blog.content}
                    </p>
                </div>

            </div>
        </div>
    )
}

export default Blog1
