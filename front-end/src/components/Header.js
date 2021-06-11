import '../App.css';
import React from 'react'
import { Link } from 'react-router-dom';
import logo from '../logo.png'
import { useEffect } from 'react';



function Header() {





    useEffect(() => {
        const burger = document.getElementsByClassName('burger')[0]
        const navLists = document.getElementsByClassName('navigation-list-header')[0]
        
        burger.addEventListener('click', () => {
            navLists.classList.toggle('active')
        })
    }, [])
    return (
        <header className="header">
            <div className="header-logo">
                <img src={logo} />
            </div>
            <ul className="navigation-list-header">
                <li className="navigation-item">
                    <div><Link to="/">Home</Link></div>
                </li>
                <li className="navigation-item">
                    <div><Link to="/about">About</Link></div>
                </li>
                <li className="navigation-item">
                    <div><Link to="/contactme">ContactMe</Link></div>
                </li>
            </ul>
            <a href="#"  className="burger">
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </a>
        </header>
    )
}

export default Header
