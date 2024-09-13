import React from 'react'
import '../App1.css';

function Projects() {
    return (
        <div className="main-content">
            <div className="main-content-projects">
                <ui>
                    <li className="main-content-projects-ui-li">
                        <a href="https://github.com/L-factorial/home-page/blob/main/front-end/src/data-structure/PriorityQueue.js">Priority Queue in Java script</a>
                    </li>
                    <li className="main-content-projects-ui-li">
                        <a href="https://github.com/L-factorial/home-page/tree/main/front-end/src/simulation-logic/eight-puzzle">A* Search - Eight puzzle</a>
                    </li>
                    <li className="main-content-projects-ui-li">
                        <a href="https://github.com/L-factorial/home-page/tree/main/front-end/src/simulation-logic/convex-hull">Convex hull computation in 2D</a>
                    </li>
                    <li className="main-content-projects-ui-li">
                        <a href="https://github.com/L-factorial/home-page/blob/main/front-end/src/simulation-logic/elastic-collision/Simulation.js">Spatial indexing - Particle collisions in 2D</a>
                    </li>
                </ui>
            </div>
        </div>
    )
}

export default Projects;