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
        // console.log(markedDownDocDataJson)
        // setmarkedDownDoc(markedDownDocDataJson)
        setmarkedDownDoc({...markedDownDocDataJson})
    }
    return (
        <div className="home">
            <div className="blog">
                <div className="blog-content">
                <Markdown>{markedDownDoc?.data?.attributes?.blocks[0]?.body}</Markdown>
                </div>
            </div>
        </div>
    )
}

export default BasicContent
