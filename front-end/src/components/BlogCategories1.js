import React from 'react';
import { Container, Card, CardDeck, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';

function BlogCategories1() {

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
                <Card style={{ width: '20rem', height: '30rem' }}>
                    {/* <Card.Img src={blog} /> */}
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
                            <Row ><Link to="#jpt">Scroll test</Link></Row>
                            <Row ><Link to="#jpt">Scroll test</Link></Row>

                            <Row ><Link to="#jpt">Scroll test</Link></Row>

                            <Row ><Link to="#jpt">Scroll test</Link></Row>

                            <Row ><Link to="#jpt">Scroll test</Link></Row>

                            <Row ><Link to="#jpt">Scroll test</Link></Row>

                            <Row ><Link to="#jpt">Scroll test</Link></Row>

                            <Row ><Link to="#jpt">Scroll test</Link></Row>
                            <Row ><Link to="#jpt">Scroll test</Link></Row>
                            <Row ><Link to="#jpt">Scroll test</Link></Row>
                            <Row ><Link to="#jpt">Scroll test</Link></Row>
                            <Row ><Link to="#jpt">Scroll test</Link></Row>
                            <Row ><Link to="#jpt">Scroll test</Link></Row>
                            <Row ><Link to="#jpt">Scroll test</Link></Row>
                            <Row ><Link to="#jpt">Scroll test</Link></Row>
                            <Row ><Link to="#jpt">Scroll test</Link></Row>
                            <Row ><Link to="#jpt">Scroll test</Link></Row>
                            <Row ><Link to="#jpt">Scroll test</Link></Row>
                            <Row ><Link to="#jpt">Scroll test</Link></Row>
                            <Row ><Link to="#jpt">Scroll test</Link></Row>
                            <Row ><Link to="#jpt">Scroll test</Link></Row>
                            <Row ><Link to="#jpt">Scroll test</Link></Row>
                            <Row ><Link to="#jpt">Scroll test</Link></Row>


                        </Card.Text>
                    </Card.Body>
                </Card>

            )

        );
    }

    return (
        
        <div className="home">
            <div className="blog-categories-cards">
            <CardDeck>
              {
                loading ? <Spinner animation="grow" /> :   renderCards()
              }
            </CardDeck>
            </div>
        </div>
    )
}

export default BlogCategories1
