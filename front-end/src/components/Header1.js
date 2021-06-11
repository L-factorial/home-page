import React from 'react'
import logo from '../logo.png'
import { Link } from 'react-router-dom';
import '../App1.css';



function Header1() {
    return (
        <header className="header">
            <div className="header-logo">
                <img src={logo} />
            </div>	        
            <ul className="header-links">
                <li className="header-links-item">
                    <div><Link to="/">Home</Link></div>
                </li>
                <li className="header-links-item">
                    <div><Link to="/about">About</Link></div>
                </li>
                <li className="header-links-item">
                    <div><Link to="/contactme">ContactMe</Link></div>
                </li>
            </ul>
            <div className="burger">
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>
        </header>
    )
}

export default Header1
