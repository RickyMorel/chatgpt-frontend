import React from 'react'
import { Color } from './Colors'

function Navbar() {
  return (
    <nav>
      <div className={`nav-wrapper ${Color.Second}`} style={{ "padding-left": '40px' }}>
        <a href="#!" className="brand-logo">Chatbot</a>
      </div>
    </nav>
  )
}

export default Navbar
