import '../App.css';

import React from 'react'
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import styled from 'styled-components';


function Footer() {

  //   const Styles = styled.div`
  //   .navbar {
  //     background-color: #222;
  //     border-raadius: 10px;
  //   }
  //   a, .navbar-brand, .navbar-nav .nav-link {
  //     color: #bbb;
  //     &:hover {
  //       color: white;
  //     }
  //   }
  // `;
    // return (
    //     <Styles>
    //         <Navbar fixed="bottom"  collapseOnSelect expand="lg">
    //             <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    //             <Navbar.Collapse id="responsive-navbar-nav">
    //                 <Nav className="justify-content-center">
    //                 <Nav.Item><Nav.Link href="#VivAndRay">VivAndRay</Nav.Link></Nav.Item>
    //                 <Nav.Item><Nav.Link href="#MyWife">MyWife</Nav.Link></Nav.Item>
    //                 <Nav.Item><Nav.Link href="#Kathmandu University">Kathmandu University</Nav.Link></Nav.Item>
    //                 </Nav>
    //             </Navbar.Collapse>
    //         </Navbar>
    //     </Styles>
    // )

  return (
    <footer className="footer">
      <ul className="navigation-list-footer">
        <li className="navigation-item">
          <div><Link to="/">Kathmandu University</Link></div>
        </li>
        <li className="navigation-item">
          <div><Link to="/">MyWife</Link></div>
        </li>
        <li className="navigation-item">
          <div><Link to="/">VivAndRay</Link></div>
        </li>
      </ul>
    </footer>
  );

}

export default Footer
