import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardDeck, Row } from 'react-bootstrap';
import { useState } from 'react';

function CreativeProgrammingList() {


    const [creativeProgrammingList, setCreativeProgrammingList] = useState([
        {
            id: 10,
            title: "Elastic Collision - Random"
        },
        {
            id: 9,
            title: "Convex Hull/ Elastic Collision"
        },
        {
            id: 12,
            title: "Snooker board - Elastic Collision"
        },
        {
            id: 7,
            title: "Elastic Collision - Pollen Grain",
        },
        {
            id: 11,
            title: "Elastic Collision - Diffusion",
        },
        {
            id: 8,
            title: "Eight Puzzle"
        },
    ])

    return (
        <div className="home">
            <div className="creative-programming-card">
                <CardDeck>
                    <Card>
                        {/* <Card.Img src={cp} /> */}
                        <Card.Body>
                            <Card.Title>
                                Creative Programming
                            </Card.Title>
                            <Card.Text>
                                {
                                    creativeProgrammingList.map(creativeProgramming => (
                                        <Row>
                                            <Link to={`/creativeProgramming/${creativeProgramming.id}`}> {creativeProgramming.title}</Link>
                                        </Row>
                                    ))
                                }
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </CardDeck>
            </div>
        </div>
    )
}

export default CreativeProgrammingList
