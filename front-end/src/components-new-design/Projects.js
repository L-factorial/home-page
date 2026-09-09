import '../App1.css';
import { Link } from 'react-router-dom';
import ProjectPreview from './ProjectPreview';

const descriptions = {
    'elastic-collision': 'Watch colorful particles bounce, collide, and exchange momentum in a two-dimensional world.',
    'elastic-collision-convex-hull': 'See the smallest enclosing polygon change as a swarm of particles moves and collides.',
    'snooker-elastic-collision': 'Explore ball collisions and rebounds on a miniature snooker table.',
    'pollen-grain-elastic-collision': 'Follow a large pollen grain as tiny particles jostle it into Brownian motion.',
    'diffusion-elastic-collision': 'Watch two groups of particles spread out and mix through collisions.',
    'family-elastic-collision': 'A playful particle simulation with family photos bouncing around the screen.',
    'nepal-fourier-curve': 'Watch rotating circles combine to trace the outline of Nepal using Fourier series.',
    'usa-capitals-voronoi': 'Explore how US capitals divide the map into regions of nearest neighbors.',
    'fourier-transform-audio': 'Explore waveforms and frequency spectra to see how unwanted audio noise can be removed.',
    'nepali-kitty': 'Watch cards being dealt and explore how hands are arranged in the Nepali game of Kitty.',
    'eight-puzzle': 'Explore a sliding-tile puzzle and see A* search find a path to the solution.',
    'magnus-effect': 'Discover how spin bends a soccer ball’s flight through the Magnus effect.',
    'karma-realization-bhakti': 'Explore a visual journey through karma, realization, and bhakti inspired by the story of seven days.',
    soccer: 'Open the soccer analysis agent to explore soccer insights and analysis.',
};

function ProjectCard({ label, slug, external = false }) {
    const content = <>
        <div className="project-card-preview">
            <ProjectPreview slug={slug} />
            <span className="project-card-overlay">{descriptions[slug]}</span>
        </div>
        <div className="project-card-caption">
            <h3>{label}</h3>
            <span aria-hidden="true">↗</span>
        </div>
    </>;
    const props = { className: 'project-card' };
    return external
        ? <a {...props} href="https://soccer-agent.lfactorial.com/" target="_blank" rel="noreferrer">{content}<span className="sr-only"> (opens in a new tab)</span></a>
        : <Link {...props} to={`/animations/${slug}`}>{content}</Link>;
}

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
                            <h2>{title}</h2>
                            <ul>
                                {demos.map(([label, slug]) => (
                                    <li key={slug}>
                                        <ProjectCard label={label} slug={slug} />
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
                <section className="project-group project-group-external">
                    <h2>Soccer analysis</h2>
                    <ul><li><ProjectCard label="Soccer analysis agent" slug="soccer" external /></li></ul>
                </section>
                <div className="projects-message">
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
