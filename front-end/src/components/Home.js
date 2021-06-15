import '../App.css';

import React from 'react'
import { Container, Row, Col, Card, CardDeck } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import cp from '../img/creativeProgramming.png'
import blog from '../img/liveLaughLove.png'
import octoCat from '../img/octocat.png'


function Home() {
    return (
        <div className="home">
            <div className="home-card">
                <CardDeck>
                    <Card className="overflow">
                        <Card.Img src={cp} className="card-img-top"/>
                        <Link to="/creativeProgramming">
                            <Card.Body>
                                <Card.Title>
                                    Creative Prograamming
                                </Card.Title>
                                <Card.Text>
                                    All about algorithm and computational geometry.
                                </Card.Text>
                            </Card.Body>
                        </Link>

                    </Card>

                    <Card className="overflow">
                        <Card.Img src={blog} className="card-img-top"/>
                        <Link to="/blogCategories">
                            <Card.Body>
                                <Card.Title>
                                    Blog
                                </Card.Title>
                                <Card.Text>
                                    All about social, philosophical and technical writing.
                                </Card.Text>
                            </Card.Body>
                        </Link>

                    </Card>

                    <Card className="overflow">
                        <Card.Img src={octoCat} className="card-img-top" />
                        <Link>
                            <Card.Body>
                                <Card.Title>
                                    Projects
                                </Card.Title>
                                <Card.Text>
                                    Cool coding with github link  and many more.
                                </Card.Text>
                            </Card.Body>
                        </Link>

                    </Card>
                </CardDeck>
            </div>
        </div>
    )
}

export default Home;