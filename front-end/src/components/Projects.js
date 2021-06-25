import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardDeck, Row } from 'react-bootstrap';

function Projects() {
    return (
        <div className="home">
            <div className="creative-programming-card">
                <CardDeck>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                Projects - Codelets
                            </Card.Title>
                            <Card.Text>
                                    <Row>
                                        <a href="https://github.com/L-factorial/home-page/blob/main/front-end/src/data-structure/PriorityQueue.js">Priority Queue in Java script</a>
                                    </Row>
                                    <Row>
                                        <a href="https://github.com/L-factorial/home-page/tree/main/front-end/src/simulation-logic/eight-puzzle">A* Search - Eight puzzle</a>
                                    </Row>
                                    <Row>
                                        <a href="https://github.com/L-factorial/home-page/tree/main/front-end/src/simulation-logic/convex-hull">Convex hull computation in 2D</a>
                                    </Row>
                                    <Row>
                                        <a href="https://github.com/L-factorial/home-page/blob/main/front-end/src/simulation-logic/elastic-collision/Simulation.js">Spatial indexing - Particle collisions in 2D</a>
                                    </Row>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </CardDeck>
            </div>
        </div>
    )
}

export default Projects;