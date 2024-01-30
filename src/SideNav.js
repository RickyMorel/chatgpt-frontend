import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Sidenav, Nav } from 'rsuite';
import { Color } from './Colors';

class SideNav extends Component  {
  render() {
    // const { pathname } = this.props.location;
    // console.log("pathname", pathname)
    return (
      <Sidenav>
        <Sidenav.Body>
          <Nav>
            <Nav.Item className={`${Color.SideNav}`} active={true}>
              <Link to="/">
                <i className="material-icons left">cloud</i>
                Cargar Datos
              </Link>
            </Nav.Item>
            <Nav.Item className={`${Color.SideNav}`}>
              <Link to="/blockChats">
                <i className="material-icons left">contacts</i>
                Bloquear Chat
              </Link>
            </Nav.Item>
            <Nav.Item className={`${Color.SideNav}`}>
              <Link to="/inventory">
                  <i className="material-icons left">local_mall</i>
                  Inventario
              </Link>
            </Nav.Item>
            <Nav.Item className={`${Color.SideNav}`}>
              <Link to="/orders">
                <i className="material-icons left">shopping_cart</i>
                Ver Pedidos
              </Link>
            </Nav.Item>
            <Nav.Item className={`${Color.SideNav}`}>
              <Link to="/dayLocation">
                <i className="material-icons left">access_time</i>
                Ver Tiempos y Lugares
              </Link>
            </Nav.Item>      
          </Nav>
        </Sidenav.Body>
      </Sidenav>
    );
  }
  
};

export default SideNav;
