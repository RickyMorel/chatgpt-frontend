import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Sidenav, Nav } from 'rsuite';
import { Color } from './Colors';
import { useLocation } from 'react-router-dom'

function SideNav()  {
  return (
    <Sidenav>
      <Sidenav.Body>
        <Nav>
          <Nav.Item className={GetNavItemColor('/')} active={true}>
            <Link to="/">
              <i className="material-icons left">cloud</i>
              Cargar Datos
            </Link>
          </Nav.Item>
          <Nav.Item className={GetNavItemColor('/blockChats')}>
            <Link to="/blockChats">
              <i className="material-icons left">contacts</i>
              Bloquear Chat
            </Link>
          </Nav.Item>
          <Nav.Item className={GetNavItemColor('/inventory')}>
            <Link to="/inventory">
                <i className="material-icons left">local_mall</i>
                Inventario
            </Link>
          </Nav.Item>
          <Nav.Item className={GetNavItemColor('/orders')}>
            <Link to="/orders">
              <i className="material-icons left">shopping_cart</i>
              Ver Pedidos
            </Link>
          </Nav.Item>
          <Nav.Item className={GetNavItemColor('/dayLocation')}>
            <Link to="/dayLocation">
              <i className="material-icons left">access_time</i>
              Ver Tiempos y Lugares
            </Link>
          </Nav.Item>      
        </Nav>
      </Sidenav.Body>
    </Sidenav>
  );
};

function GetNavItemColor(navPath) {
  const currentPath = useLocation().pathname;

  return navPath == currentPath ? Color.Fifth : Color.SideNav
}

export default SideNav;
