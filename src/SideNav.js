import 'materialize-css/dist/css/materialize.min.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { Color } from './Colors';

const SideNav = () => {
  return (
    <ul class="sidenav sidenav-fixed">
      <li>
        <Link className={`waves-effect waves-light btn ${Color.Button_1}`} to="/blockChats">
            <i className="material-icons">contacts</i>
            Bloquear Chat
        </Link>
      </li>
      <li>
        <Link className={`waves-effect waves-light btn ${Color.Button_1}`} to="/inventory">
            <i className="material-icons">local_mall</i>
            Inventario
        </Link>
      </li>
      <li>
        <Link className={`waves-effect waves-light btn ${Color.Button_1}`} to="/orders">
            <i className="material-icons">shopping_cart</i>
            Ver Pedidos
        </Link>
      </li>
      <li>
        <Link className={`waves-effect waves-light btn ${Color.Button_1}`} to="/dayLocation">
            <i className="material-icons">access_time</i>
            Ver Tiempos y Lugares
        </Link>
      </li>
    </ul>
  );
};

export default SideNav;
