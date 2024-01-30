import React from 'react'

function Navbar() {
  return (
    <nav>
      <div className="nav-wrapper">
        <a href="#!" className="brand-logo">Logo</a>
        <ul className="right hide-on-med-and-down">
          <li><a href="#!">Home</a></li>
          <li><a href="#!">About</a></li>
          <li><a href="#!">Contact</a></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
