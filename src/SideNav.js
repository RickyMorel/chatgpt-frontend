import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SideNav extends Component  {
  render() {
    return (
      <ul>
        <li>
          <Link to="/blockChats">
            <i className="material-icons left">contacts</i>
            Bloquear Chat
          </Link>
        </li>
        <li>
          <Link to="/inventory">
              <i className="material-icons left">local_mall</i>
              Inventario
          </Link>
        </li>
        <li>
          <Link to="/orders">
            <i className="material-icons left">shopping_cart</i>
            Ver Pedidos
          </Link>
        </li>
        <li>
          <Link to="/dayLocation">
            <i className="material-icons left">access_time</i>
            Ver Tiempos y Lugares
          </Link>
        </li>
      </ul>
    );
  }
  
};

export default SideNav;
