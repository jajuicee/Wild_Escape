import { useEffect, useState } from "react";
//Temp Images Only//
const aboutHeader = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80";

const AboutHeader = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const parallaxOffset = scrollY * 0.5;

  return (
    <div style={{
      position: "relative",
      height: "65vh",
      minHeight: "500px",
      width: "100%",
      overflow: "hidden",
      backgroundColor: "#0f172a"
    }}>
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -40%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
        @keyframes drawLine {
          from {
            width: 0;
          }
          to {
            width: 80px;
          }
        }
      `}</style>

     
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        transform: `translateY(${parallaxOffset}px)`,
        transition: "transform 0.1s ease-out"
      }}>
        <div style={{
          backgroundImage: `url(${aboutHeader})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "120%",
          width: "100%",
          position: "absolute",
          top: "-10%"
        }} />
        
        {/* Gradient Overlays */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.7))"
        }} />
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(15, 23, 42, 0.3) 100%)"
        }} />
      </div>

      
      <div style={{
        position: "absolute",
        top: "20%",
        right: "10%",
        width: "200px",
        height: "200px",
        border: "2px solid rgba(37, 99, 235, 0.2)",
        borderRadius: "50%",
        animation: isVisible ? "fadeInScale 1.5s ease-out" : "none"
      }} />
      <div style={{
        position: "absolute",
        bottom: "15%",
        left: "8%",
        width: "150px",
        height: "150px",
        border: "2px solid rgba(37, 99, 235, 0.15)",
        borderRadius: "12px",
        transform: "rotate(45deg)",
        animation: isVisible ? "fadeInScale 1.8s ease-out 0.2s both" : "none"
      }} />

      {/* Content Container */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        zIndex: 2,
        width: "90%",
        maxWidth: "900px",
        animation: isVisible ? "slideUp 1s ease-out" : "none"
      }}>
        {/* Decorative Line Above */}
        <div style={{
          width: "80px",
          height: "3px",
          backgroundColor: "#2563eb",
          margin: "0 auto 2rem",
          animation: isVisible ? "drawLine 0.8s ease-out 0.3s both" : "none"
        }} />

        {/* Main Title */}
        <h1 style={{
          color: "white",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          textAlign: "center",
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          margin: "0 0 1.5rem 0",
          textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          lineHeight: 1.1
        }}>
          About Us
        </h1>

        {/* Subtitle */}
        <p style={{
          color: "rgba(255, 255, 255, 0.9)",
          fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
          margin: "0",
          fontWeight: 300,
          letterSpacing: "0.02em",
          textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
          maxWidth: "700px",
          marginLeft: "auto",
          marginRight: "auto",
          lineHeight: 1.6
        }}>
          Redefining the way you explore, book, and experience the world
        </p>

        {/* Decorative Line Below */}
        <div style={{
          width: "60px",
          height: "2px",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          margin: "2rem auto 0",
          animation: isVisible ? "drawLine 0.8s ease-out 0.5s both" : "none"
        }} />
      </div>

      {/* Scroll Indicator */}
      <div style={{
        position: "absolute",
        bottom: "2rem",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 1s ease-out 1s",
        animation: "bounce 2s infinite"
      }}>
        <style>{`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateX(-50%) translateY(0);
            }
            40% {
              transform: translateX(-50%) translateY(-10px);
            }
            60% {
              transform: translateX(-50%) translateY(-5px);
            }
          }
        `}</style>
        <span style={{
          color: "rgba(255, 255, 255, 0.7)",
          fontSize: "0.875rem",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontWeight: 500
        }}>
          Scroll
        </span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2">
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
      </div>
    </div>
  );
};

export default AboutHeader;