import '../App.css';

import React from 'react'
import { Link } from 'react-router-dom';



function Footer() {
  return (
    <footer className="footer">
      <ul className="navigation-list-footer">
        <li className="navigation-item">
          <Link to="/"><div>Kathmandu University</div></Link>
        </li>
        <li className="navigation-item">
          <Link to="/"><div>MyWife</div></Link>
        </li>
        <li className="navigation-item">
          <Link to="/"><div>VivAndRay</div></Link>
        </li>
      </ul>
    </footer>
  );

}

export default Footer
