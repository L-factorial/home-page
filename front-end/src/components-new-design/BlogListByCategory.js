import '../App1.css';
import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';


const BlogListByCategory = ()=> {
    const {category} = useParams()

    useEffect(() => {
        fetchBlogList()
    }, [category]) //// Re-run the effect whenever the category changes

    const [blogList, setBlogList] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchBlogList = async() => {
        setLoading(true)
        const blogListRaw = await fetch(`/blogsByCategory/${category}`)
        const blogListJson = await blogListRaw.json()
        setBlogList(blogListJson)
        setLoading(false)
    }
    const blogListHtml = () => {
        if(loading) {
            return  <div> Blog list loading </div>
        }
        else {
            return(
                <div className="main-content-blogs-nav-items">
                    <ui className="main-content-blogs-nav-items-ui">
                        {
                            blogList?.map(blog => (
                                <div className="main-content-blogs-nav-items-ui-li ">
                                    <Link to={`/blog/${category}/${blog.id}`}>
                                        {blog.tittle}
                                    </Link>
                                </div>
                            ))
                        }
                    </ui>
                </div>
            )
        }
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