import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faArrowRightFromBracket, faCartShopping, faChartSimple, faClipboardList, faCloud, faRobot, faTriangleExclamation, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { isDesktop } from 'react-device-detect';
import { Link, useHistory, useLocation, withRouter } from 'react-router-dom';
import { Sidenav } from 'rsuite';
import { ColorHex } from './Colors';
import CssProperties from './CssProperties';
import CustomButton from './Searchbar/CustomButton';
import LogoInput from './Searchbar/LogoInput';
import './SideNav.css';
import Utils from './Utils';
import HttpRequest from './HttpRequest';

function SideNav(props)  {
  const [hasNewProblematicChat, setHasNewProblematicChat] = useState(false);
  const [playSound, setPlaySound] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [totalClientsToMessage, setTotalClientsToMessage] = useState(0);
  const history = useHistory();
  let fetchSoundCount = 0

  useEffect(() => {
    setMessageCount(props?.globalConfig?.usedMonthlyMessages)
    setTotalClientsToMessage(props?.globalConfig?.maxMonthlyMessages)
  })

  useEffect(() => {
    if(window.token && window.token.length > 0) { return; }

    if(!isDesktop) { history.push('/clientOrderPlacing'); return; }

    if(Utils.loginExemptPaths.includes(history.location.pathname)) { return; }

    history.push('/');
  }, []);

  useEffect(() => {
    if (playSound) {
      handleSoundPlay();
    }
  }, [playSound]);

  const handleLogOut = () => {
    Cookies.remove('token');
    window.token = ""
    props.setIsReloading(true)
    history.push('/');
    setTimeout(() => window.location.reload(), 100)
  }

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
    if(currentPath == "/problematicChats") { setHasNewProblematicChat(false); }
  };

  const handleLinkClick = async (e, link) => {
    const disableCondition = !props?.setupConditions.minimumConditionsMet && link != "/aiConfiguration" &&  link != "/inventory"
    
    if(props.globalConfig.isGloballyBlocked && !disableCondition) {props.toastCallback(Utils.deativateBlockClientsToast, ColorHex.OrangeFabri);}

    if(disableCondition) {
      e.preventDefault();
      console.log("props a", props)
      props.showSetupPopup(props?.setupConditions, props.history)
    }

    console.log("handleLinkClick", Utils.lastSaveCallback)

    if(Utils.lastSaveCallback) {
      e.preventDefault();
      openNotSavePopup(link)
    }
  }

  
  const openNotSavePopup = (link) => {
      props.showPopup_2_Buttons(
        "Guardar Cambios",
        `Estas seguro que no queres guardar tus cambios?`,
        " ",
        [],
        () => { Utils.lastSaveCallback(); Utils.lastSaveCallback = undefined},
        () => { props.history.push(link); Utils.lastSaveCallback = undefined},
        "No gracias",
        "Guardar"
    )
  }

  const navBarButton = [
    {icon: faCartShopping, nameText: "Pedidos", link: "/orders"},
    {icon: faUserGroup, nameText: "Clientes", link: "/blockChats"},
    {icon: faClipboardList, nameText: "Inventario", link: "/inventory"},
    {icon: faClock, nameText: "Tiempos y Lugares", link: "/dayLocation"},
    {icon: faTriangleExclamation, nameText: "Atención Especial", link: "/problematicChats"},
    {icon: faChartSimple, nameText: "Estadisticas", link: "/stats"},
    // {icon: faCloud, nameText: "Cargar Datos", link: "/loadData"},
    {icon: faRobot, nameText: "Configuración IA", link: "/aiConfiguration"},
  ]

  const navBarButtonHtmls = navBarButton.map(x => {
    if(x.link == "/inventory" && props?.globalConfig?.usesInventory == false) { return; }
    if(x.link == "/orders" && props?.globalConfig?.usesInventory == false) { return; }
    
    const disableCondition = !props?.setupConditions?.minimumConditionsMet && x.link != "/aiConfiguration" &&  x.link != "/inventory"
    const navBarButtonStyle = GetNavButtonStyle(x.link, disableCondition)

    return (
    <Link  onClick={(e) => handleLinkClick(e, x.link)} to={x.link} style={navBarButtonStyle} className='nav-item rounded'>
      <FontAwesomeIcon icon={x.icon} style={{ fontSize: '25px' }}/>
      <p style={{...CssProperties.BodyTextStyle, paddingLeft: '10px', marginTop: '15px'}}>{x.nameText}</p>
    </Link>
    )
  })

  return (
    <Sidenav style={{ height: '125vh'}}>
      <Sidenav.Body style={{ backgroundColor: ColorHex.White, boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.5)', height: '100%'}}>
        <div className="d-flex flex-column p-3" style={{ height: '100%' }}>
          <div className="text-center p-3">
            <LogoInput imageURL={props?.globalConfig?.companyLogoUrl}/>
          </div>
          <hr className='border border-dark'/>
          {navBarButtonHtmls}
          <div className="mt-auto">
            <div className="card rounded" style={{ height: '72px', width: '216px', boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.5)', border:`1px solid ${ColorHex.BorderColor}`, backgroundColor: ColorHex.White}}>
              <p className='text-center' style={{ ...CssProperties.BodyTextStyle, color: ColorHex.TextBody, marginTop: '8px' }}>Mensajes Enviados</p>
              <p className='text-center' style={{ ...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, marginTop: '-16px'}}>{`${messageCount}/${totalClientsToMessage}`}</p>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <img src='./images/icon.png' alt="Logo" className="img-fluid" style={{ width: '25px', height: "25px", marginTop: '7px', marginRight: '3px' }} />
              <p style={{ ...CssProperties.BodyTextStyle, color: ColorHex.TextBody, marginTop: '8px' }} className='text-center'>WhatsBot</p>
            </div>
          </div>
          <div><CustomButton text="Cerrar Sesión" width="100%" icon={faArrowRightFromBracket} onClickCallback={handleLogOut}/></div>
        </div>
      </Sidenav.Body>
    </Sidenav>
  );
};

function GetNavButtonStyle(navPath, isDisabled) {
  const currentPath = useLocation().pathname;

  let navBarButtonStyle = {
    opacity: isDisabled ? 0.5 : 1,
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
    border: navPath == currentPath ? `1px solid ${ColorHex.BorderColor}` : '0px',
    borderLeft: navPath == currentPath ? `5px solid ${ColorHex.GreenDark_1}` : '0px'
  }

  return navBarButtonStyle
}  

export default withRouter(SideNav);
