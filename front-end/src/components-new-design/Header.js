import '../App1.css';
import { Link } from 'react-router-dom';
import profilePic from '../profilepic.jpg'
import { useState, useEffect } from 'react';

function Header() {
    useEffect(() => {
        const burger = document.querySelector('.burger');
        const sidebarMain = document.querySelector('.sidebar-main');
        const mainContent = document.querySelector('.main-content');
        setSidebarMain(sidebarMain)
        setMainContent(mainContent)
        const handleBurgerClick = () => {
            sidebarMain.classList.toggle('active')
            mainContent.classList.toggle('hidden')
        };
        burger.addEventListener('click', handleBurgerClick)
        return () => burger.removeEventListener('click', handleBurgerClick);
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

    const [sidebarMain, setSidebarMain] = useState(null)
    const [mainContent, setMainContent] = useState(null)

    return (
        <aside className = "sidebar">
            <div className = "sidebar-header">
                <div className="sidebar-header-title-area">
                    <div className="sidebar-header-title-area-text">
                        LFactorial.com
                    </div>
   
                </div>
                <div className="sidebar-header-burger-area">
                    <button className="burger" >&#9776;</button>

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
                            {/* <Link to="/kathmanduUniversity" onClick={handleLinkClick}>Kathmandu University</Link> */}
                            <a href='https://ku.edu.np/'>Kathmandu University</a>
                            <Link to="/projects" onClick={handleLinkClick}>Projects</Link>
                            <div className="sidebar-blog-label">Blogs</div> 
                            <div className="sidebar-blog-status">Under construction</div>
                        </nav>
                </div>

            </div>

        </aside>
    )
}

export default Header
