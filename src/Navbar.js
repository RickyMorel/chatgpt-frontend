import React from 'react'
import { Color } from './Colors'

function Navbar() {
  return (
    <nav>
      <div className={`nav-wrapper ${Color.Second}`}>
        <a href="#!" className="brand-logo">Chatbot</a>
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
