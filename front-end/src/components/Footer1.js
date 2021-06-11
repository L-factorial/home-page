import React from 'react'
import '../App1.css';
import { Link } from 'react-router-dom';


function Footer1() {
    return (
        <footer className="footer">
        <ul className="footer-links">
          <li className="footer-links-item">
            <div><Link to="/">Kathmandu University</Link></div>
          </li>
          <li className="footer-links-item">
            <div><Link to="/">MyWife</Link></div>
          </li>
          <li className="footer-links-item">
            <div><Link to="/">VivAndRay</Link></div>
          </li>
        </ul>
      </footer>
    )
}

export default Footer1
