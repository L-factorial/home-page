import React from 'react'
import { useState, useEffect } from 'react';
import '../App.css';
import EightPuzzle from  './simulations/eightPuzzle/EightPuzzle';
import ElasticCollisionRandomConfig from './simulations/elasticCollision/ElasticCollisionRandomConfig';
import ElasticCollisionRandomConfigWithConvexHull from './simulations/elasticCollision/ElasticCollisionRandomConfigWithConvexHull';
import ElasticCollisionSnookerBoard from './simulations/elasticCollision/ElasticCollisionSnookerBoard';
import ElasticCollisionPollenGrain from './simulations/elasticCollision/ElasticCollisionPollenGrain';


function CreativeProgrammingDisplay({match}) {

    const simulatitons = [
        {
            id: 1,
            title: "Elastic Collision",
            canvas: <ElasticCollisionRandomConfig />,
        },
        {
            id: 2,
            title: "Elastic Collision",
            canvas: <ElasticCollisionRandomConfigWithConvexHull />,
        },
        {
            id: 3,
            title: "Elastic Collision",
            canvas: <ElasticCollisionSnookerBoard />,
        },
        {
            id: 4,
            title: "Elastic Collision - Pollen Grain",
            canvas: <ElasticCollisionPollenGrain />,
        },
        {
            id: 5,
            title: "Eight Puzzle",
            canvas: <EightPuzzle />
        },
    ]

    const [simulation, setSimulation] = useState({})
    useEffect(() => {
        setSimulation(simulatitons.filter(s => s.id == match.params.id)[0]);
    }, [simulation])

    return (
        <div className="home">
        <div className = "simulation-container">
            <div className = "simulation-title-container"><h4>{simulation.title}</h4></div>
            <div className = "simulation-description-container"></div>
            <div id= "canvadDivId" className = "simulation-canvas-container">
                {simulation.canvas}
            </div>
        </div>
        </div>
    )
}

export default CreativeProgrammingDisplay
