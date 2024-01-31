import React from 'react'
import { Color } from './Colors'

function Navbar() {
  return (
    <nav>
      <div className={`nav-wrapper ${Color.Second}`} style={{ "padding-left": '40px' }}>
        <a href="#!" className="brand-logo">Chatbot</a>
        <ul id="nav-mobile" class="right hide-on-med-and-down">
          <li style={{ "padding-right": '20px' }}>Emporio Aleman</li>
          <li style={{ "padding-right": '20px' }}><img width="62" height="62" src="images/companyLogo.jpg" alt="" class="circle responsive-img"/></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
