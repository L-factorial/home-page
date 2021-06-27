import React from 'react';
import Markdown from 'react-markdown';
import { useState, useEffect } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
// import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import rehypeHighlight from 'rehype-highlight';


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
           <Markdown rehypePlugins={[rehypeHighlight]}>
               {markedDownDoc.content}
            </Markdown>
        </div>
    );
}


// const Component = ({value, language}) => {
//   return (
//     <SyntaxHighlighter language={language ?? null} style={docco}>
//       {value ?? ''}
//     </SyntaxHighlighter>
//   );
// };

export default CreativeProgrammingDescriptionMarkdown;