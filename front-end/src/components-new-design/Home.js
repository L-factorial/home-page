import '../App1.css';

import EightPuzzle from  './simulations/eightPuzzle/EightPuzzle';
import ElasticCollisionRandomConfig from './simulations/elasticCollision/ElasticCollisionRandomConfig';
import ElasticCollisionRandomConfigWithConvexHull from './simulations/elasticCollision/ElasticCollisionRandomConfigWithConvexHull';
import ElasticCollisionSnookerBoard from './simulations/elasticCollision/ElasticCollisionSnookerBoard';
import ElasticCollisionPollenGrain from './simulations/elasticCollision/ElasticCollisionPollenGrain';
import ElasticCollisionDiffusion from './simulations/elasticCollision/ElasticCollisionDiffusion';
import ElasticCollisionFamilyPics from './simulations/elasticCollision/ElasticCollisionFamilyPics'
import Markdown from 'react-markdown';


import React, { useEffect, useState } from 'react';
const simulatitons = [
    {
        id: 10,
        title: "Elastic Collision",
        canvas: <ElasticCollisionRandomConfig />,
    },
    {
        id: 9,
        title: "Elastic Collision",
        canvas: <ElasticCollisionRandomConfigWithConvexHull />,
    },
    {
        id: 12,
        title: "Elastic Collision",
        canvas: <ElasticCollisionSnookerBoard />,
    },
    {
        id: 7,
        title: "Elastic Collision - Pollen Grain",
        canvas: <ElasticCollisionPollenGrain />,
    },
    {
        id: 11,
        title: "Elastic Collision - Diffusion",
        canvas: <ElasticCollisionDiffusion />,
    },
    {
        id: 6,
        title: "My family: Viv, Ray and us",
        canvas: <ElasticCollisionFamilyPics />,

    },

    {
        id: 8,
        title: "Eight Puzzle",
        canvas: <EightPuzzle />
    },
]

function Home() {
  const [selectedSimulation, setSelectedSimulation] = useState(simulatitons[0]);
  const [simulationIdx, setSimulationIdx] = useState(0);
  const [displayOption, setDisplayOption] = useState('animation');
  const [simulationDescriptionBlog, setSimulationDescriptionBlog] = useState({})
  const [loading, setLoading] = useState(false)


  useEffect(()=>{
      fetchSimulationDescriptionBlog()
    },
    [selectedSimulation]
  )

  
    const fetchSimulationDescriptionBlog = async () => {
      setLoading(true)
      const simulationDescriptionBlogData = await fetch(`/blogs/${selectedSimulation.id}`);
      const simulationDescriptionBlogDataJson = await simulationDescriptionBlogData.json();
      setSimulationDescriptionBlog({...simulationDescriptionBlogDataJson})
      setLoading(false)

    }
    const handleSimulationSelect = (simulation) => {
      setSelectedSimulation(simulation);
    };
    const handleSimulationIdx = () => {
      setSimulationIdx((simulationIdx+1)%simulatitons.length)
      setSelectedSimulation(simulatitons[simulationIdx]);
    }
  
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
            <button class="double-arrow-btn" onClick={()=>handleSimulationIdx()}>»</button>
          </div>
      </div>
      )
    }

    const display = ()=> {
      return (
      <div className = "main-content-simulation-container-display">
      {displayOption === 'animation' ? (
                                <div id= "canvadDivId" className = "main-content-simulation-animation">
                                {selectedSimulation.canvas}
                            </div>
      ) : (
        <div className="main-content-blog">
            {loading ? "Loading ..." : <Markdown>{simulationDescriptionBlog?.data?.attributes?.blocks[0]?.body}</Markdown>}
        </div>
      )}
    </div>
      )
    }
  
    return (
      <main className="main-content">
        <div className="main-content-simulation ">
            {header()}
            {toggle()}
            {display()}
        </div>
      </main>
    );

}

export default Home;