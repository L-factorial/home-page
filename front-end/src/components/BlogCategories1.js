import React from 'react';
import { Container, Card, CardDeck, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import blog from '../blogImg.png'

function BlogCategories1() {

    const [blogsGroupedByCategory, setBlogsGroupedByCategory] = useState([])
    useEffect(() => {
        fetchBlogsGroupedByCategory();
    }, [])



    const fetchBlogsGroupedByCategory = async() => {
        const groupedBlogs = await fetch('/blogsGroupedByCategory');
        const groupedBlogsJson = await groupedBlogs.json();
        setBlogsGroupedByCategory(groupedBlogsJson)
    }



    const renderCards = () => {
        return (
            blogsGroupedByCategory.map(blogsByGroup =>
                <Card style={{ width: '30rem', height: '40rem' }}>
                    <Card.Img src={blog} />
                    <Card.Body>
                        <Card.Title>
                            {blogsByGroup[0].category.name}
                        </Card.Title>
                        <Card.Text>
                            {

                                blogsByGroup.map(blog => (
                                    <Row key={blog.id} >
                                        <Link to={`/blogs/${blog.id}`}>
                                            {blog.tittle}
                                        </Link>
                                    </Row>
                                ))
                            }

                        </Card.Text>
                    </Card.Body>
                </Card>

            )

        );
    }

    return (
        
        <div className="home">
            <CardDeck>
              {
                  renderCards()
              }
            </CardDeck>
        </div>
    )
}

export default BlogCategories1
