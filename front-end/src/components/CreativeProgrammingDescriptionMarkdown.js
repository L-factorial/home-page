import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';


function CreativeProgrammingDescriptionMarkdown(props) {
    const [markedDownDoc, setmarkedDownDoc] = useState({})
    useEffect(() => {
        fetchmarkedDownDoc()
    }, [])
    const fetchmarkedDownDoc = async () => {
        const markedDownDocData = await fetch(`/markedDownDoc/${props.markedDownDocId}`);
        // const markedDownDocData = await fetch('/markedDownDoc/1');

        const markedDownDocDataJson = await markedDownDocData.json();
        console.log(markedDownDocDataJson)
        setmarkedDownDoc(markedDownDocDataJson)
    }
    return (
        <div className = "simulation-description-container"> 
           <ReactMarkdown renderers = {{
               code: Component,
           }}>
               {markedDownDoc.content}
            </ReactMarkdown>
        </div>
    );
}


const Component = ({value, language}) => {
  return (
    <SyntaxHighlighter language={language ?? null} style={docco}>
      {value ?? ''}
    </SyntaxHighlighter>
  );
};

export default CreativeProgrammingDescriptionMarkdown;
