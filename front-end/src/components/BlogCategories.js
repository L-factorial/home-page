import React from 'react';
import { Container, Card , CardDeck, Row} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import blog from '../blogImg.png'



function BlogCategories() {


    // const [blogs, setBlogs] = useState([
    //     {
    //         title: 'JeevanKaKura',
    //         id: 1,

    //     },
    //     {
    //         title: 'Food',
    //         id: 2,

    //     },
    //     {
    //         title: 'TM',
    //         id: 3,

    //     },
    // ]);

    const [blogCategories, setBlogCategories] = useState([]);
    useEffect(() => {
        fetchBlogCategories();
    }, [])
    const fetchBlogCategories = async () => {
        const categories = await fetch('/categories');
        const categoriesJson = await categories.json();
        console.log(categories)
        setBlogCategories(categoriesJson)
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

                                blogCategories.map(blogCategory => (
                                    <Row key={blogCategory.id} >
                                        <Link  to={`/blogCategories/${blogCategory.id}`}>
                                            {blogCategory.name}
                                        </Link>
                                    </Row>
                                ))
                            }

                        </Card.Text>
                    </Card.Body>
                </Card>
                </CardDeck>
        </div>
    )
}

export default BlogCategories
