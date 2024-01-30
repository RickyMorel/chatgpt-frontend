import React, { useEffect } from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css';

const SideNav = () => {
  return (
    <ul id="slide-out" class="sidenav sidenav-fixed">
      <li><a href="#!">First Sidebar Link</a></li>
      <li><a href="#!">Second Sidebar Link</a></li>
    </ul>
  );
};

export default SideNav;
