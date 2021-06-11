import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Card, CardDeck } from 'react-bootstrap';
import { useState } from 'react';
import cp from '../creativeProgramming.png'

function CreativeProgrammingList() {


    const [creativeProgrammingList, setCreativeProgrammingList] = useState([
        {
            id: 1,
            title: "Elastic Collision"
        },
        {
            id: 2,
            title: "Eight Puzzle"
        },
    ])

    return (
        <div className = "home">
            <CardDeck>
            <Card style={{ width: '18rem', height: '30rem' }}>
                <Card.Img src={cp} />
                <Card.Body>
                    <Card.Title>
                        Creative Prograamming
                    </Card.Title>
                    <Card.Text>
                        {
                            creativeProgrammingList.map(creativeProgramming => (
                                <div>
                                    <Link to={`/creativeProgramming/${creativeProgramming.id}`}> {creativeProgramming.title}</Link>
                                </div>
                            ))
                        }
                    </Card.Text>
                </Card.Body>
            </Card>
            </CardDeck>
        </div>
    )
}

export default CreativeProgrammingList
