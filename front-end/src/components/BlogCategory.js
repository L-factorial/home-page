import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Card, CardDeck } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import blog from '../blogImg.png'

function BlogCategory({ match }) {
    // const jeevanKaaKura = {
    //     id: 1,
    //     blogs: [
    //         {
    //             id: 1,
    //             title: 'Earth and mars',

    //         },
    //         {
    //             id: 2,
    //             title: '20 kai de',

    //         },
    //         {
    //             id: 3,
    //             title: 'Big car',

    //         },
    //     ],
    // }

    // const food = {
    //     id: 2,
    //     blogs: [
    //         {
    //             id: 5,
    //             title: 'Falooda',

    //         },
    //         {
    //             id: 4,
    //             title: 'Kimchi',

    //         },
    //         {
    //             id: 6,
    //             title: 'Sushi',

    //         },
    //     ],
    // }

    // const allBlogs = [jeevanKaaKura, food];

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
