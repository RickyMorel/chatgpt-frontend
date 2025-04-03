import React, { useRef, useEffect, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import { ColorHex } from './Colors';

const Canvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 999;
  width: 100vw;
  height: 100vh;
`;

const EMOJIS = ['🎉','🎊'];
const EMOJI_COLORS = ['#FFD700', '#FF69B4'];

class EmojiParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velocity = {
      x: (Math.random() - 0.5) * 0.5,
      y: Math.random() * 2 + 1
    };
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 0.5;
    this.fontSize = Math.random() * 20 + 24;
    this.alpha = 1;
    this.decay = 0.002;
    this.emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    this.color = EMOJI_COLORS[Math.floor(Math.random() * EMOJI_COLORS.length)];
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.rotation += this.rotationSpeed;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.alpha;
    ctx.font = `${this.fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.color;
    ctx.fillText(this.emoji, 0, 0);
    ctx.restore();
  }
}

const handleSuccessToast = () => {
  toast.success(`Completaste la configuracion inicial de WhatsBot!🎉🎉. Ahora podes empezar a testear. Haga click en el boton que te esta resaltando!`, {
    style: {
        backgroundColor: ColorHex.GreenDark_1,
        color: '#fff',
        fontWeight: 'bold',
        padding: '10px',
    },
    progressStyle: {
        backgroundColor: '#fff',
    },
    autoClose: 15000,
    icon: false
  });
}

const ParticleExplosion = ({ trigger }) => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const animationFrameId = useRef(null);
  const intervalId = useRef(null);
  const particlesCreated = useRef(0);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.current = particles.current.filter(particle => {
      particle.update();
      particle.draw(ctx);
      return particle.y < canvas.height + 50 && particle.alpha > 0;
    });

    animationFrameId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [handleResize]);

  useEffect(() => {
    if (trigger) {
      handleSuccessToast()
      particlesCreated.current = 0;
      
      intervalId.current = setInterval(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const x = Math.random() * canvas.width;
        const y = -50;
        particles.current.push(new EmojiParticle(x, y));
        
        particlesCreated.current += 1;
        if (particlesCreated.current >= 60) {
          clearInterval(intervalId.current);
          intervalId.current = null;
        }
      }, 50);

      animate();
    } else {
      if (intervalId.current) clearInterval(intervalId.current);
      particles.current = [];
    }

    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
    };
  }, [trigger, animate]);

  return (
    <>
      <ToastContainer />
      <Canvas ref={canvasRef} />;
    </>
  )
};

export default ParticleExplosion;