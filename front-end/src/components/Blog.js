import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Card, CardDeck } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import blogImg from '../blogImg.png'



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
            <div className="blog-card">
                <CardDeck >
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                {blog.tittle}
                            </Card.Title>
                            <Card.Subtitle>Published : {blog.published_at}    Last updated: {blog.updated_at}</Card.Subtitle>
                            <Card.Text>
                                {blog.content}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </CardDeck>
            </div>
        </div>
    )
}

export default Blog
