import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom';

import { FiArrowLeft } from "react-icons/fi";
import Markdown from 'react-markdown';
import { getArticleById } from '../data/dummyContent';



function Blog() {
    const {id, category} = useParams()
    const blog = getArticleById(id)
    const backArrow = () => {
        return (
            <div>
                <Link to={`/blogListByCategory/${category}`} > <FiArrowLeft/></Link>
            </div>  
        )       
    }
    return (
        <div className="main-content">
            <div className="main-content-blog-container">
            {backArrow()}
                <div className="blog-date">
                    <div> Published: {blog?.publishedAt || 'Unknown'} </div>
                    <div> Last updated: {blog?.updatedAt || 'Unknown'} </div>
                </div>
                <div className="blog-title">
                    {blog?.title || 'Article not found'}
                </div>
                <div className="main-content-blog">
                    <Markdown>{blog?.body || 'The requested dummy article does not exist.'}</Markdown>
                </div>
            </div>

        </div>
    )
}

export default Blog
