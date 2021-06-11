import '../App.css';

import React from 'react'
import { Container, Row, Col, Card ,CardDeck} from 'react-bootstrap';
import { Link } from 'react-router-dom';

import cp from '../creativeProgramming.png'
import blog from '../blogImg.png'
import octoCat from '../Octocat.png'

// import 'bootstrap/dist/css/bootstrap.min.css'

function Home() {
    return(
        <div className="home">
            <CardDeck>
                    <Card style={{ height: '21rem', width:'18rem'}}>
                        <Card.Img src={cp} />
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
                    
                    <Card style={{height: '21rem'  }}>
                        <Card.Img  src={blog} />
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

                    <Card style={{ height: '21rem',  overflow: 'hidden'}}>
                        <Card.Img  src={octoCat} style={{overflow: 'hidden'}}/>
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
    )
}

export default Home;