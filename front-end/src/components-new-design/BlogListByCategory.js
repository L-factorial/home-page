import '../App1.css';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getArticlesByCategory } from '../data/dummyContent';


const BlogListByCategory = ()=> {
    const {category} = useParams()

    const blogList = getArticlesByCategory(category)
    const blogListHtml = () => {
            return(
                <div className="main-content-blogs-nav-items">
                    <ul className="main-content-blogs-nav-items-ui">
                        {
                            blogList?.map(blog => (
                                <li key={blog.id} className="main-content-blogs-nav-items-ui-li ">
                                    <Link to={`/blog/${category}/${blog.id}`}>
                                        {blog.title}
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            )
    }
    return(
        <main className ="main-content">
            <div className="main-content-blog-list">
                {blogListHtml()}
            </div>
        </main>
    )

}

export default BlogListByCategory
