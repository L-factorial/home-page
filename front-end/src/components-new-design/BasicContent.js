import Markdown from 'react-markdown';
import { pageContent } from '../data/dummyContent';



function BasicContent({ contentKey }) {
    return (
        <div className="main-content">
            <div className="main-content-blog-container">
            <div className="main-content-blog">
                <Markdown>{pageContent[contentKey] || '# Content not found'}</Markdown>
            </div>
            </div>

        </div>
    )
}

export default BasicContent
