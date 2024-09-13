import React from 'react'
import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';



function BasicContent(props) {
    const [markedDownDoc, setmarkedDownDoc] = useState({})
    useEffect(() => {
        fetchmarkedDownDoc()
    }, [])
    const fetchmarkedDownDoc = async () => {
        const markedDownDocData = await fetch(`/blogs/${props.markedDownDocId}`);
        const markedDownDocDataJson = await markedDownDocData.json();
        setmarkedDownDoc({...markedDownDocDataJson})
    }
    return (
        <div className="main-content">
            <div className="main-content-blog-container">
            <div className="main-content-blog">
                <Markdown>{markedDownDoc?.data?.attributes?.blocks[0]?.body}</Markdown>
            </div>
            </div>

        </div>
    )
}

export default BasicContent
