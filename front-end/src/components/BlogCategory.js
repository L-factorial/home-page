import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Card, CardDeck } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import blog from '../blogImg.png'

function BlogCategory({ match }) {
    const [catetgorizedBlogs, setCatetgorizedBlogs] = useState([])

    useEffect(() => {
        fetchBlogs()
    }, [])

    const fetchBlogs =  async () => {
        const blogs = await fetch(`/blogsByCategory/${match.params.id}`);
        const blogsJson = await blogs.json();
        console.log(blogsJson);
        setCatetgorizedBlogs(blogsJson);
    }
    return (
        <div className="home">
            <CardDeck>
                <Card style={{ width: '30rem', height: '40rem' }}>
                    <Card.Img src={blog} />
                    <Card.Body>
                        <Card.Title>
                            Blog
                                </Card.Title>
                        <Card.Text>
                            {
                                catetgorizedBlogs.map(blog => (
                                    // <div key = {blog.id} >
                                    <Link key = {blog.id}  to={`/blogs/${blog.id}`}>
                                        <div>
                                        {blog.tittle}
                                        </div>
                                        </Link>
                                ))
                            }
                        </Card.Text>
                    </Card.Body>
                </Card>
                </CardDeck>
        </div>
    )
}

export default BlogCategory
