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

  const navBarButtonHtmls = navBarButton.map(x => {
    const navBarButtonStyle = GetNavButtonStyle(x.link)

    return (
    <div style={navBarButtonStyle} className={GetNavItemColor(x.link)}>
      <i className="material-icons me-2">{x.icon}</i>
      <Link to={x.link} style={{textDecoration: 'none', color: 'inherit', marginTop: '15px'}}>
        <p style={{...CssProperties.BodyTextStyle, paddingLeft: '10px'}}>{x.nameText}</p>
      </Link>
    </div>
    )
  })

  console.log("navBarButtonHtmls", navBarButtonHtmls)

  return (
    <Sidenav>
      <Sidenav.Body style={{ backgroundColor: ColorHex.SideNav, boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.5)'}}>
        <div className="d-flex flex-column p-3" style={{ height: '100vh' }}>
          <div className="text-center p-3">
            <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbQLGnT0RH-Rh0_5NefuPRVbUAXU0CxPfpDw&s' alt="Logo" className="img-fluid" style={{ width: '125px', height: "125px", borderRadius: '24px' }} />
          </div>
          <hr className='border border-dark'/>
          {navBarButtonHtmls}
          <div className="mt-auto">
            <div className="card rounded" style={{ height: '72px', width: '216px', boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.5)', border:`1px solid ${ColorHex.borderColor}`}}>
              <p className='text-center' style={{ ...CssProperties.BodyTextStyle, color: ColorHex.textBody, marginTop: '8px' }}>Mensajes Enviados</p>
              <p className='text-center' style={{ ...CssProperties.SmallHeaderTextStyle, color: ColorHex.textBody, marginTop: '-16px'}}>711/711</p>
            </div>
            <p style={{ ...CssProperties.BodyTextStyle, color: ColorHex.textBody, marginTop: '8px' }} className='text-center'>Chat bot AI</p>
          </div>
        </div>
      </Sidenav.Body>
    </Sidenav>
  );
};

function GetNavItemColor(navPath) {
  const currentPath = useLocation().pathname;

  return navPath == currentPath ? "shadow-lg nav-item rounded" : "nav-item rounded"
}

function GetNavButtonStyle(navPath) {
  const currentPath = useLocation().pathname;

  let navBarButtonStyle = {
    display: 'flex',
    width: '100%',
    height: '45px',
    marginTop: '10px',
    alignItems: 'center',
    paddingLeft: '10px',
    paddingRight: '10px',
    textAlign: 'center',
    border: navPath == currentPath ? `1px solid ${ColorHex.borderColor}` : '0px'
  }

  return navBarButtonStyle
}  

export default SideNav;
