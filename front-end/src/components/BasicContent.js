import React from 'react'
import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';



function BasicContent(props) {
    const [markedDownDoc, setmarkedDownDoc] = useState({})
    useEffect(() => {
        fetchmarkedDownDoc()
    }, [])
    const fetchmarkedDownDoc = async () => {
        const markedDownDocData = await fetch(`/markedDownDoc/${props.markedDownDocId}`);
        const markedDownDocDataJson = await markedDownDocData.json();
        setmarkedDownDoc(markedDownDocDataJson)
    }
    return (
        <div className="home">
            <div className="blog">
                <div className="blog-content">
                    <Markdown>{markedDownDoc.content}</Markdown>
                </div>
            </div>
        </div>
    )
}

export default BasicContent
