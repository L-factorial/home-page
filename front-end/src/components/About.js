import React, { Component } from 'react'
import { Card, CardDeck } from 'react-bootstrap';

function About() {

    return (


        <div className="home">
            <div className="aboutme-card">
                <CardDeck >
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                About Me
                            </Card.Title>
                            <Card.Text>
                                <p>
                                    This is my personal home page with an intention to learn and share my learnings. I am a global citizen born and raised in Nepal. I love sports (more so cricket), beers, cooking and deep conversations. Ring my bell any time and we can go deep about life and livings being each other psychiatrist popping off few chilled <a href="https://www.belgianstyleales.com/category/shop-chimay-trappist-beers">Chimay</a>.
                                </p>

                                <p>
                                    Telephone, Electricity and  Aeroplane are the top three inventions. In my wild imagination I sometime feel I will evict out one of the three making a room for HashMap.
                                </p>
                                <p>
                                    Sir Vivian Richards is the greatest player to ever play cricket.
                                </p>                            
                                </Card.Text>
                            <Card.Footer>
                                <p>Factorially yours...</p>
                                <p>-Prajwal</p>

                            </Card.Footer>
                        </Card.Body>
                    </Card>
                </CardDeck>
            </div>
        </div>

    )

}

export default About
