import React from 'react';
import Markdown from 'react-markdown';
import { useState, useEffect } from 'react';
import rehypeHighlight from 'rehype-highlight';
import { Spinner } from 'react-bootstrap';



function CreativeProgrammingDescriptionMarkdown(props) {
    const [markedDownDoc, setmarkedDownDoc] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchmarkedDownDoc()
    }, [])
    const fetchmarkedDownDoc = async () => {
        const markedDownDocData = await fetch(`/markedDownDoc/${props.markedDownDocId}`);
        const markedDownDocDataJson = await markedDownDocData.json();
        console.log(markedDownDocDataJson)
        setmarkedDownDoc(markedDownDocDataJson)
        setLoading(false)

    }

    const renderLoading = () => {
        return(
            <>
                <Spinner animation="border" size="sm" />
                <Spinner animation="border" />
                <Spinner animation="grow" size="sm" />
                <Spinner animation="grow" />
                <Spinner animation="border" variant="primary" />
                <Spinner animation="grow" variant="info" />
                <div><h6>Loading ...</h6></div>
            </>
        )
    }

    return (
        <div className = "simulation-description-container"> 
           <Markdown rehypePlugins={[rehypeHighlight]}>
               {loading ? renderLoading() : markedDownDoc.content}
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
