import { useState } from 'react';
import './LandingPage.css';
import CustomButton from '../Searchbar/CustomButton';
import CssProperties from '../CssProperties';
import { ColorHex } from '../Colors';
import PriceCard from './PriceCard';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      title: "Atención Inteligente Automatizada 24/7",
      description: "Ofrece respuestas instantáneas y personalizadas a tus clientes vía WhatsApp usando inteligencia artificial.",
      icon: "🤖"
    },
    {
        title: "Analíticas Impulsada por IA",
        description: "Descubre qué productos tienen mayor éxito en ventas al instante",
        icon: "📈"
    },    
    {
        title: "Fácil Configuración de la IA",
        description: "Configura tu WhatsBot en minutos con una plataforma de autoservicio fácil de usar y sin conocimientos técnicos.",
        icon: "✅"
      },
  ];

  const titleHTML = 
    <section className="hero-section">
        <div className="container">
            <div className="hero-content">
              <h1 style={{fontFamily: "Work Sans"}}>Automatiza tu atención al cliente con IA</h1>
              <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody}}>Responde a tus clientes en tiempo real y mejora su experiencia con nuestra Inteligencia Artificial para WhatsApp.</p>
              <div className="hero-video" style={{ marginTop: '20px', textAlign: 'center' }}>
                <iframe 
                    width="80%" 
                    height="600px" 
                    src="https://www.youtube.com/embed/fhiBVSf_mvg?modestbranding=1&rel=0&showinfo=0" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen>
                </iframe>
                </div>
                <div style={{display: 'flex', justifyContent: 'center', marginTop: '25px'}}><CustomButton text="Comienza la prueba gratuita" width="300px" height="60px" classStyle="btnGreen-clicked" link="login"/></div>
            </div>
        </div>
    </section>

    const featuresHTML = 
    <section id="features" className="features-section">
        <div className="container">
        <h2 style={{...CssProperties.LargeHeaderTextStyle}}>Características Principales</h2>
        <div className="features-grid">
            {features.map((feature, index) => (
            <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 style={{...CssProperties.LargeHeaderTextStyle}}>{feature.title}</h3>
                <p style={{...CssProperties.BodyTextStyle}}>{feature.description}</p>
            </div>
            ))}
        </div>
        </div>
    </section>

    const pricingHTML = 
    <section id="features" className="features-section">
        <div className="container">
            <h2 style={{...CssProperties.LargeHeaderTextStyle}}>Precios</h2>
            <div style={{display: 'flex', flexDirection: 'row', gap: '25px', justifyContent: 'space-between'}}>
                {features.map((feature, index) => (
                    <PriceCard/>
                ))}
            </div>
        </div>
    </section>

  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="container">
        <div className="nav-content">
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '-50px'}}>
                <img src='./images/icon.png' alt="Logo" className="img-fluid" style={{ width: '50px', height: "50px"  }} />
                <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.GreenDark_1, fontWeight: 'bold', marginTop: '15px', marginLeft: '10px'}}>WhatsBot</p>
            </div>
            <div style={{ marginLeft: '1000px' }}><CustomButton text="Comienza la prueba gratuita" width="250px" height="45px" classStyle="btnGreen-clicked" link="login"/></div>
            </div>
        </div>
      </nav>

       <div className="row">
            <div className="col-12">
                <div style={scrollPanelStyle}>
                    <div style={scrollStyle}>
                        {titleHTML}
                        {featuresHTML}
                        {pricingHTML}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

const scrollStyle = {
    overflowY: 'auto', 
    height: '125vh',
    width: '100%',
    alignItems: 'center',
    overflowX: 'hidden',
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE and Edge
  }

const scrollPanelStyle = {

  }

export default LandingPage;