import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sidenav } from 'rsuite';
import { ColorHex } from './Colors';
import CssProperties from './CssProperties';
import firebase from "./firebaseConfig";
import './SideNav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faClipboardList, faCloud, faTriangleExclamation, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';

function SideNav(props)  {
  const [hasNewProblematicChat, setHasNewProblematicChat] = useState(false);
  const [playSound, setPlaySound] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [totalClientsToMessage, setTotalClientsToMessage] = useState(0);
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
    if (!props.botNumber) {
        return;
    }

    const ref = firebase.collection('globalConfig').doc(String(props.botNumber));

    ref.get()
      .then((doc) => {
        const response = doc.data()
        setMessageCount(response.messageCount)
        setTotalClientsToMessage(response.totalClientsToMessage)
      })
      .catch((error) => {
        console.error('Error getting document:', error);
      });
  }

  // const fetchChatData = async () => {
  //     // if (!props.botNumber) {
  //     //     return;
  //     // }

  //     // const ref = firebase.collection(String(props.botNumber)).orderBy('createdDate')
  //     // ref.onSnapshot(query => {
  //     //   let chats = []
  //     //   query.forEach(doc => {
  //     //       chats.push(doc.data())
  //     //   }) 

  //     //   handleSoundPlay(chats)
  //     //   //PLAY AUDIO HERE
  //     // })
  // };

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
    {icon: faCartShopping, nameText: "Pedidos", link: "/orders"},
    {icon: faUserGroup, nameText: "Clientes", link: "/blockChats"},
    {icon: faClipboardList, nameText: "Inventario", link: "/inventory"},
    // {icon: faTriangleExclamation, nameText: "Atención Especial", link: "/problematicChats"},
    {icon: faClock, nameText: "Tiempos y Lugares", link: "/dayLocation"},
    {icon: faCloud, nameText: "Cargar Datos", link: "/"},
  ]

  const navBarButtonHtmls = navBarButton.map(x => {
    const navBarButtonStyle = GetNavButtonStyle(x.link)

    return (
    <Link to={x.link} style={navBarButtonStyle} className='nav-item rounded'>
      <FontAwesomeIcon icon={x.icon} style={{ fontSize: '25px' }}/>
      <p style={{...CssProperties.BodyTextStyle, paddingLeft: '10px', marginTop: '15px'}}>{x.nameText}</p>
    </Link>
    )
  })

  return (
    <Sidenav>
      <Sidenav.Body style={{ backgroundColor: ColorHex.White, boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.5)'}}>
        <div className="d-flex flex-column p-3" style={{ height: '100vh' }}>
          <div className="text-center p-3">
            <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbQLGnT0RH-Rh0_5NefuPRVbUAXU0CxPfpDw&s' alt="Logo" className="img-fluid" style={{ width: '125px', height: "125px", borderRadius: '24px' }} />
          </div>
          <hr className='border border-dark'/>
          {navBarButtonHtmls}
          <div className="mt-auto">
            <div className="card rounded" style={{ height: '72px', width: '216px', boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.5)', border:`1px solid ${ColorHex.BorderColor}`, backgroundColor: ColorHex.White}}>
              <p className='text-center' style={{ ...CssProperties.BodyTextStyle, color: ColorHex.TextBody, marginTop: '8px' }}>Mensajes Enviados</p>
              <p className='text-center' style={{ ...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, marginTop: '-16px'}}>{`${messageCount}/${totalClientsToMessage}`}</p>
            </div>
            <p style={{ ...CssProperties.BodyTextStyle, color: ColorHex.TextBody, marginTop: '8px' }} className='text-center'>Chat bot AI</p>
          </div>
        </div>
      </Sidenav.Body>
    </Sidenav>
  );
};

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
    textDecoration: 'none', 
    color: 'inherit',
    boxShadow: navPath == currentPath ? '0px 5px 5px rgba(0, 0, 0, 0.5)' : '0px 0px 0px rgba(0, 0, 0, 0.5)',
    border: navPath == currentPath ? `1px solid ${ColorHex.BorderColor}` : '0px'
  }

  return navBarButtonStyle
}  

export default SideNav;
