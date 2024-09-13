import '../App.css';
import React from 'react'
import { Link } from 'react-router-dom';
import logo from '../logo.png'
import { useState, useEffect } from 'react';



function Header() {
    // useEffect(() => {
    //     const burger = document.getElementsByClassName('burger')[0]
    //     const navLists = document.getElementsByClassName('navigation-list-header')[0]
        
    //     burger.addEventListener('click', () => {
    //         navLists.classList.toggle('active')
    //     })
    // }, [])
    const [blogCategories, setBlogCategories] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchBlogCategories = async() => {
        setLoading(true)
        const allBlogCategories = await fetch('/blogCategories');
        const allBlogCategoriesJson = await allBlogCategories.json();
        setBlogCategories(allBlogCategoriesJson)
        setLoading(false);
    }
    useEffect(() => {

        fetchBlogCategories();

    }, [])



    const getBlogCategories = () => {
        if(loading) {
            console.log('Inside getBlogCategories true')

            console.log(loading)

            return <div> Blog Categories loading ...</div>
        }
        else {
            console.log('Inside getBlogCategories false')

            return <div> 
                blogs
                <ui>
                    {blogCategories?.map((category) => (
                            <li>{category}</li>
                        ))}
                </ui>
            </div>
        }
    }
    return (
        <header className="header">
            <div className="header-logo">
                <Link to="/"><img src={logo} /></Link>
            </div>
            <ul className="navigation-list-header">
                <li className="navigation-item">
                    <Link to="/"><div className="heade-anchor">Home</div></Link>
                </li>
                <li className="navigation-item">
                    <Link to="/about"><div>About</div></Link>
                </li>
                <li className="navigation-item">
                    <Link to={`/creativeProgramming/6`}><div>MyFamily</div></Link>
                </li>
                <li className="navigation-item">
                    <Link to="/kathmanduUniversity"><div>Kathmandu University</div></Link>
                </li>
            </ul>
            {console.log(loading)}
            {getBlogCategories()}
            
            <a href="#"  className="burger">
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </a>
        </header>
    )
}

export default Header
