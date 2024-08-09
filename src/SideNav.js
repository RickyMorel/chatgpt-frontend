import React, { Component, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sidenav, Nav } from 'rsuite';
import { Color, ColorHex } from './Colors';
import { useLocation } from 'react-router-dom'
import useSound from 'use-sound';
import firebase from "./firebaseConfig";
import CssProperties from './CssProperties';
import './SideNav.css';

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

  const navBarButton = [
    {icon: "shopping_cart", nameText: "Pedidos", link: "/orders"},
    {icon: "contacts", nameText: "Clientes", link: "/blockChats"},
    {icon: "local_mall", nameText: "Inventario", link: "/inventory"},
    {icon: "call", nameText: "Atención Especial", link: "/problematicChats"},
    {icon: "access_time", nameText: "Tiempos y Lugares", link: "/dayLocation"},
    {icon: "cloud", nameText: "Cargar Datos", link: "/"},
  ]

  const navBarButtonHtmls = navBarButton.map(x =>
    <Nav.Item style={navBarButtonStyle} className={GetNavItemColor(x.link)} active={true}>
      <i className="material-icons me-2">{x.icon}</i>
      <Link to={x.link} className="d-flex align-items-center justify-content-center">
        <p style={{ fontSize: CssProperties.BodyTextSize, paddingLeft: '15px' }}>{x.nameText}</p>
      </Link>
    </Nav.Item>
  )

  console.log("navBarButtonHtmls", navBarButtonHtmls)

  return (
    <Sidenav>
      <Sidenav.Body style={{ backgroundColor: ColorHex.SideNav}}>
          <Nav>
          <div className="p-3">
            <div className="text-center p-3">
              <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbQLGnT0RH-Rh0_5NefuPRVbUAXU0CxPfpDw&s' alt="Logo" className="img-fluid" style={{ width: '125px', height: "125px", borderRadius: '10%' }} />
            </div>
            <hr  className='border border-dark'/>
            {navBarButtonHtmls}
          </div>
              <div class="card" style={{height: '72px', width: '100%', display: 'flex'}}>
                <div class="card-body text-center">
                  <p style={{fontSize: CssProperties.BodyTextSize, color: ColorHex.textBody}}>Mensajes Enviados</p>
                  <p style={{fontSize: CssProperties.SmallHeaderTextSize, color: ColorHex.textBody}}>711/711</p>
                </div>
              </div>
            <p style={{fontSize: CssProperties.BodyTextSize, color: ColorHex.textBody}} className='text-center'>Chat bot AI</p>
          </Nav>
      </Sidenav.Body>
    </Sidenav>
  );
};

function GetNavItemColor(navPath) {
  const currentPath = useLocation().pathname;

  return navPath == currentPath ? "shadow-lg nav-item" : "nav-item"
}

const navBarButtonStyle = {
  display: 'flex',
  width: '100%',
  height: '45px',
  marginTop: '10px',
  borderRadius: '8%'
}

export default SideNav;
