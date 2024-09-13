import '../App1.css';
import React from 'react'
import { Link } from 'react-router-dom';
import profilePic from '../profilepic.jpg'
import { useState, useEffect } from 'react';

function Header() {
    useEffect(() => {
        fetchBlogCategories();
        const burger = document.querySelector('.burger');
        const sidebarMain = document.querySelector('.sidebar-main');
        const mainContent = document.querySelector('.main-content');
        setSidebarMain(sidebarMain)
        setMainContent(mainContent)
        burger.addEventListener('click', () => {
            sidebarMain.classList.toggle('active')
            mainContent.classList.toggle('hidden')
        })
    }, [])

    const handleLinkClick = () => {
        const burgerDisplayStyle = window.getComputedStyle(document.querySelector('.burger')).display;
        if (burgerDisplayStyle && sidebarMain && mainContent){
            if (burgerDisplayStyle == 'block') {
                sidebarMain.classList.toggle('active')
                mainContent.classList.toggle('hidden')
            }
        }
    };

    const [blogCategories, setBlogCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [sidebarMain, setSidebarMain] = useState(null)
    const [mainContent, setMainContent] = useState(null)

    const fetchBlogCategories = async() => {
        setLoading(true)
        const allBlogCategories = await fetch('/blogCategories');
        const allBlogCategoriesJson = await allBlogCategories.json();
        setBlogCategories(allBlogCategoriesJson)
        setLoading(false);
    }

    const getBlogCategories = () => {
        if(loading) {
            return <div> Blog Categories loading ...</div>
        }
        else {
            return (
                blogCategories?.map( (category) => (
                    <Link to={`/blogListByCategory/${category}`} onClick={handleLinkClick}>{category}</Link>
                )

                )
            )
            
        }
    }

    return (
        <aside className = "sidebar">
            <div className = "sidebar-header">
                <div className="sidebar-header-title-area">
                    <div className="sidebar-header-title-area-text">
                        LFactorial.com
                    </div>
   
                </div>
                <div className="sidebar-header-burger-area">
                    <button class="burger" >&#9776;</button>

                </div>                
            </div>

            <div className="sidebar-main">
                <div className = "sidebar-main-pic">
                    <img src={profilePic} alt="Profile Picture"/>
                </div>

                <div className = "sidebar-main-content">
                        <nav className="sidebar-nav-links">
                            <Link to="/home" onClick={handleLinkClick}>Home</Link>
                            <Link to="/about" onClick={handleLinkClick}>About</Link>
                            <Link to="/kathmanduUniversity" onClick={handleLinkClick}>Kathmandu University</Link>
                            <Link to="/projects" onClick={handleLinkClick}>Projects</Link>
                            <div className="sidebar-blog-label">Blogs</div> 
                            {getBlogCategories()}
                        </nav>
                </div>

            </div>

        </aside>
    )
}

export default Header
