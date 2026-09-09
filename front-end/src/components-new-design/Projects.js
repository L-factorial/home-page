import '../App1.css';
import { Link } from 'react-router-dom';

const projectGroups = [
    {
        title: 'Elastic Collision',
        demos: [
            ['Random ball collisions', 'elastic-collision'],
            ['Ball collisions with convex hull', 'elastic-collision-convex-hull'],
            ['Snooker board', 'snooker-elastic-collision'],
            ['Pollen grain', 'pollen-grain-elastic-collision'],
            ['Diffusion', 'diffusion-elastic-collision'],
            ['Family pictures', 'family-elastic-collision'],
        ],
    },
    {
        title: 'Fourier Transform',
        demos: [
            ['Nepal map', 'nepal-fourier-curve'],
            ['USA map', 'usa-capitals-voronoi'],
            ['Audio noise removal', 'fourier-transform-audio'],
        ],
    },
    {
        title: 'Convex Hull',
        demos: [['Elastic collision with convex hull', 'elastic-collision-convex-hull']],
    },
    {
        title: 'Voronoi',
        demos: [['USA map', 'usa-capitals-voronoi']],
    },
    {
        title: 'Card Game',
        demos: [['Kitty', 'nepali-kitty']],
    },
    {
        title: 'Eight Puzzle',
        demos: [['Eight puzzle', 'eight-puzzle']],
    },
    {
        title: 'Magnus Effect',
        demos: [['Why a soccer ball curves', 'magnus-effect']],
    },
    {
        title: 'Seven Days',
        demos: [['Karma → Realization → Bhakti', 'karma-realization-bhakti']],
    },
];

function Projects() {
    return (
        <div className="main-content">
            <div className="main-content-projects">
                <header className="projects-header">
                    <h1>Projects</h1>
                    <p>Explore interactive animations, algorithms, and experiments.</p>
                </header>
                <div className="projects-grid">
                    {projectGroups.map(({ title, demos }) => (
                        <section className="project-group" key={title}>
                            <h2><Link to={`/animations/${demos[0][1]}`}>{title}</Link></h2>
                            <ul>
                                {demos.map(([label, slug]) => (
                                    <li key={slug}>
                                        <Link to={`/animations/${slug}`}>{label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
                <div className="projects-message">
                    <a href="https://soccer-agent.lfactorial.com/" target="_blank" rel="noreferrer">
                        Soccer analysis agent
                    </a>
                    <span className="projects-message-label">More projects and experiments</span>
                    <a href="https://github.com/L-factorial" target="_blank" rel="noreferrer">
                        Follow my GitHub
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Projects;
