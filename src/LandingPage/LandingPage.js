import { useState } from 'react';
import './LandingPage.css';
import CustomButton from '../Searchbar/CustomButton';
import CssProperties from '../CssProperties';
import { ColorHex } from '../Colors';
import PriceCard from './PriceCard';
import LandingPageNavbar from './LandingPageNavbar';

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

  const prices = [
    {
        price: 149,
        discountedPrice: 99,
        cardColor: ColorHex.GreenDark_1,
        packName: "Paquete Inicial",
        messageAmount: 1000,
        description: "La forma más inteligente de automatizar las interacciones con clientes y aumentar el compromiso sin esfuerzo. Ideal para empresas en crecimiento" 
    },
    {
        price: 299,
        discountedPrice: 215,
        cardColor: ColorHex.OrangeFabri,
        packName: "Paquete Empresarial",
        messageAmount: 5000,
        description: "Una forma simple y asequible de automatizar las interacciones con clientes. Ideal para pequeñas empresas que buscan mejorar el compromiso y la eficiencia" 
    },
    {
        price: 399,
        discountedPrice: 299,
        cardColor: ColorHex.RedFabri,
        packName: "Paquete Pro",
        messageAmount: 10000,
        description: "En lugar de un equipo de ventas, solo una persona asistida por IA. Ideal para empresas medianas que interactúan con más de 100 clientes a diario" 
    }
  ]

  const titleHTML = 
    <section className="hero-section">
        <div className="container">
            <div className="hero-content">
              <h1 style={{fontFamily: "Work Sans"}}>Automatiza tu atención al cliente con IA</h1>
              <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody}}>Responde a tus clientes en tiempo real y mejora su experiencia con nuestra Inteligencia Artificial para WhatsApp.</p>
              <div className="hero-video" style={{ marginTop: '20px', textAlign: 'center' }}>
                <iframe 
                    width="80%" 
                    height="575px" 
                    src="https://www.youtube.com/embed/Q9vNgqwS2LM?modestbranding=1&rel=0&showinfo=0" 
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
            <div className="features-grid">
                {prices.map(x => (
                    <PriceCard data={x}/>
                ))}
            </div>
        </div>
    </section>

  return (
    <div className="landing-page">
        <LandingPageNavbar/>

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