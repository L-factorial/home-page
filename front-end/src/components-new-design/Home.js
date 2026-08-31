import '../App1.css';

import EightPuzzle from  './simulations/eightPuzzle/EightPuzzle';
import ElasticCollisionRandomConfig from './simulations/elasticCollision/ElasticCollisionRandomConfig';
import ElasticCollisionRandomConfigWithConvexHull from './simulations/elasticCollision/ElasticCollisionRandomConfigWithConvexHull';
import ElasticCollisionSnookerBoard from './simulations/elasticCollision/ElasticCollisionSnookerBoard';
import ElasticCollisionPollenGrain from './simulations/elasticCollision/ElasticCollisionPollenGrain';
import ElasticCollisionDiffusion from './simulations/elasticCollision/ElasticCollisionDiffusion';
import ElasticCollisionFamilyPics from './simulations/elasticCollision/ElasticCollisionFamilyPics'
import FourierNepal from './simulations/fourierNepal/FourierNepal';
import MagnusEffect from './simulations/magnusEffect/MagnusEffect';
import KittyDeal from './simulations/kitty/KittyDeal';
import UsaVoronoi from './simulations/usaVoronoi/UsaVoronoi';
import FourierAudioDemo from './simulations/fourierAudio/FourierAudioDemo';
import Markdown from 'react-markdown';
import { getSimulationSnippet } from '../data/simulationSnippetRepository';
import { useNavigate, useParams } from 'react-router-dom';


import { useEffect, useState } from 'react';
const simulatitons = [
    {
        id: 13,
        slug: 'nepal-fourier-curve',
        title: "Nepal as a Fourier Curve",
        canvas: <FourierNepal />,
    },
    {
        id: 17,
        slug: 'fourier-transform-audio',
        title: "Fourier Transform — Hear the Frequencies",
        canvas: <FourierAudioDemo />,
    },
    {
        id: 16,
        slug: 'usa-capitals-voronoi',
        title: "What If Mainland USA Followed Voronoi State Capital Cells?",
        canvas: <UsaVoronoi />,
    },
    {
        id: 15,
        slug: 'nepali-kitty',
        title: "Nepali Kitty — Shuffle and Deal",
        canvas: <KittyDeal />,
    },
    {
        id: 14,
        slug: 'magnus-effect',
        title: "Magnus Effect — Why a Soccer Ball Curves",
        canvas: <MagnusEffect />,
    },
    {
        id: 10,
        slug: 'elastic-collision',
        title: "Elastic Collision",
        canvas: <ElasticCollisionRandomConfig />,
    },
    {
        id: 9,
        slug: 'elastic-collision-convex-hull',
        title: "Elastic Collision with Convex Hull",
        canvas: <ElasticCollisionRandomConfigWithConvexHull />,
    },
    {
        id: 12,
        slug: 'snooker-elastic-collision',
        title: "Elastic Collision - Snooker Board",
        canvas: <ElasticCollisionSnookerBoard />,
    },
    {
        id: 7,
        slug: 'pollen-grain-elastic-collision',
        title: "Elastic Collision - Pollen Grain",
        canvas: <ElasticCollisionPollenGrain />,
    },
    {
        id: 11,
        slug: 'diffusion-elastic-collision',
        title: "Elastic Collision - Diffusion",
        canvas: <ElasticCollisionDiffusion />,
    },
    {
        id: 6,
        slug: 'family-elastic-collision',
        title: "My family: Viv, Ray and us",
        canvas: <ElasticCollisionFamilyPics />,

    },

    {
        id: 8,
        slug: 'eight-puzzle',
        title: "Eight Puzzle",
        canvas: <EightPuzzle />
    },
]

function Home() {
  const { animationSlug } = useParams();
  const navigate = useNavigate();
  const requestedIndex = simulatitons.findIndex(({ slug }) => slug === animationSlug);
  const initialIndex = requestedIndex >= 0 ? requestedIndex : 0;
  const [selectedSimulation, setSelectedSimulation] = useState(simulatitons[initialIndex]);
  const [simulationIdx, setSimulationIdx] = useState(initialIndex);
  const [displayOption, setDisplayOption] = useState('animation');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [snippetLoading, setSnippetLoading] = useState(true);
  const [snippetError, setSnippetError] = useState('');

    useEffect(() => {
      if (!animationSlug) return;
      const index = simulatitons.findIndex(({ slug }) => slug === animationSlug);
      if (index < 0) {
        navigate(`/animations/${simulatitons[0].slug}`, { replace: true });
        return;
      }
      setSimulationIdx(index);
      setSelectedSimulation(simulatitons[index]);
      setDisplayOption('animation');
      document.title = `${simulatitons[index].title} · LFactorial`;
    }, [animationSlug, navigate]);

    useEffect(() => {
      let cancelled = false;
      setSnippetLoading(true);
      setSnippetError('');

      getSimulationSnippet(selectedSimulation.id)
        .then((snippet) => {
          if (!cancelled) setCodeSnippet(snippet);
        })
        .catch(() => {
          if (!cancelled) setSnippetError('The explanation could not be loaded.');
        })
        .finally(() => {
          if (!cancelled) setSnippetLoading(false);
        });

      return () => {
        cancelled = true;
      };
    }, [selectedSimulation.id]);

    const handleSimulationIdx = () => {
      const nextIndex = (simulationIdx + 1) % simulatitons.length;
      setSimulationIdx(nextIndex)
      setSelectedSimulation(simulatitons[nextIndex]);
      setDisplayOption('animation');
      navigate(`/animations/${simulatitons[nextIndex].slug}`);
    }

    const handlePreviousSimulation = () => {
      const previousIndex = (simulationIdx - 1 + simulatitons.length) % simulatitons.length;
      setSimulationIdx(previousIndex);
      setSelectedSimulation(simulatitons[previousIndex]);
      setDisplayOption('animation');
      navigate(`/animations/${simulatitons[previousIndex].slug}`);
    };
  
    const handleDisplayOptionChange = (e) => {
      setDisplayOption(e.target.value);
    };

    const toggle = () => {
      return(
        <div className="main-content-simulation-animation-explaination-toggle">
        <label>
          <input 
            type="radio" 
            value="animation" 
            checked={displayOption === 'animation'} 
            onChange={handleDisplayOptionChange} 
          />
          Show Animation
        </label>
        <label style={{ marginLeft: '20px' }}>
          <input 
            type="radio" 
            value="code" 
            checked={displayOption === 'code'} 
            onChange={handleDisplayOptionChange} 
          />
          Show Code Snippet
        </label>
      </div>
      )
    }

    const header = ()=> {
      return(
        <div className="main-content-simulation-header">
          <div className="main-content-simulation-header-title ">
            <div className="main-content-simulation-header-title-text">
              {selectedSimulation.title}
            </div>
          </div>
          <div className="main-content-simulation-header-next">
            <button className="double-arrow-btn" onClick={handlePreviousSimulation} aria-label="Show previous simulation">«</button>
            <button className="double-arrow-btn" onClick={()=>handleSimulationIdx()} aria-label="Show next simulation">»</button>
          </div>
      </div>
      )
    }

    const display = ()=> {
      return (
      <div className = "main-content-simulation-container-display">
      {displayOption === 'animation' ? (
                                <div id= "canvadDivId" className = "main-content-simulation-animation">
                                <div key={selectedSimulation.slug} className="simulation-route-content">
                                  {selectedSimulation.canvas}
                                </div>
                            </div>
      ) : (
        <div className="main-content-blog simulation-code-snippet">
            {snippetLoading && <p>Loading explanation…</p>}
            {snippetError && <p>{snippetError}</p>}
            {!snippetLoading && !snippetError && <Markdown>{codeSnippet}</Markdown>}
        </div>
      )}
    </div>
      )
    }
  
    return (
      <main className="main-content simulation-page">
        <div className="main-content-simulation ">
            {header()}
            {toggle()}
            {display()}
        </div>
      </main>
    );

}

export default Home;
