import React, { Component, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sidenav, Nav } from 'rsuite';
import { Color, ColorHex } from './Colors';
import { useLocation } from 'react-router-dom'
import useSound from 'use-sound';
import firebase from "./firebaseConfig";

function SideNav(props)  {
  const [hasNewProblematicChat, setHasNewProblematicChat] = useState(false);
  const [playSound, setPlaySound] = useState(false);
  let fetchSoundCount = 0

  useEffect(() => {
      fetchChatData();
  }, [props.botNumber]);

  useEffect(() => {
    if (playSound) {
      handleSoundPlay();
    }
  }, [playSound]);

  const fetchChatData = async () => {
      // if (!props.botNumber) {
      //     return;
      // }

      // const ref = firebase.collection(String(props.botNumber)).orderBy('createdDate')
      // ref.onSnapshot(query => {
      //   let chats = []
      //   query.forEach(doc => {
      //       chats.push(doc.data())
      //   }) 

      //   handleSoundPlay(chats)
      //   //PLAY AUDIO HERE
      // })
  };

  const handleSoundPlay = (chats) => {
    fetchSoundCount = fetchSoundCount + 1

    if(chats.length <= 0) { setHasNewProblematicChat(false); return; }

    if(fetchSoundCount < 3) {return;}

    setHasNewProblematicChat(true)

    var audio = new Audio('./problemSFX.mp3');
    audio.play();
    audio.onended = () => {
      setPlaySound(false);
    };
  };

  const handleNavItemClick = (currentPath) => {
    console.log("handleNavItemClick", currentPath)
    if(currentPath == "/problematicChats") { setHasNewProblematicChat(false); }
  };

  return (
    <Sidenav >
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
              Clientes
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
          <Nav.Item className={GetNavItemColor('/problematicChats')} onClick={() => handleNavItemClick('/problematicChats')}>
            <Link to="/problematicChats">
              <div className="row">
                <div className="col s1">
                  <i className="material-icons left">call</i>
                </div>
                <div className="col s9">
                  Atención Especial
                </div>
                <div className="col s2">
                  {hasNewProblematicChat == true ? <i style={{ color: ColorHex.First }} className={`material-icons flicker`}>brightness_1</i> : <div></div>}
                </div>
              </div>
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
