import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Card, CardDeck} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import blogImg from '../blogImg.png'



function Blog({ match }) {
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
            <CardDeck >
                <Card style={{ width: '30rem', height: '40rem' }}>
                    <Card.Img src={blogImg} />
                    <Card.Body>
                        <Card.Title>
                            {blog.tittle}
                        </Card.Title>
                        <Card.Text>
                            {blog.content}
                        </Card.Text>
                    </Card.Body>
                </Card>
                </CardDeck>
        </div>
    )
}

export default Blog
