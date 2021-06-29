import React from 'react';
import {Card, CardDeck, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';

function BlogCategories() {

    const [blogsGroupedByCategory, setBlogsGroupedByCategory] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        fetchBlogsGroupedByCategory();
    }, [])



    const fetchBlogsGroupedByCategory = async() => {
        setLoading(true)
        const groupedBlogs = await fetch('/blogsGroupedByCategory');
        const groupedBlogsJson = await groupedBlogs.json();
        setBlogsGroupedByCategory(groupedBlogsJson)
        setLoading(false);
    }



    const renderCards = () => {
        return (
            blogsGroupedByCategory.map(blogsByGroup =>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            {blogsByGroup[0].category.name}
                        </Card.Title>
                        <Card.Text>
                            {

                                blogsByGroup.map(blog => (
                                    <Row key={blog.id} >
                                        <Link to={`/blog/${blog.id}`}>
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

    const renderLoading = () => {
        return(
            <>
                <Spinner animation="border" size="sm" />
                <Spinner animation="border" />
                <Spinner animation="grow" size="sm" />
                <Spinner animation="grow" />
                <Spinner animation="border" variant="primary" />
                <Spinner animation="grow" variant="info" />
                <div><h6>Loading ...</h6></div>
            </>
        )
    }

    return (
        
        <div className="home">
            <div className="blog-categories-cards">
            <CardDeck>
              {
                loading ? renderLoading() :  renderCards()
              }
            </CardDeck>
            </div>
        </div>
    )
}

export default BlogCategories
