import { useEffect, useState } from "react";

// Temporary Images Only but useable//
const marketImg = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80";
const flagsImg = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80";

const HotelIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
  </svg>
);

const MoneyIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
  </svg>
);

const AboutContent = () => {
  const [scrollY, setScrollY] = useState(0);
  const [visibleElements, setVisibleElements] = useState(new Set());

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set([...prev, entry.target.dataset.index]));
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll("[data-index]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const content = [
    {
      title: "Our Mission",
      desc: "Simplifying global bookings with reliable technology, clear pricing, and effortless user experience.",
    },
    {
      title: "Our Vision",
      desc: "To be the most trusted and seamless booking platform across all industries and destinations worldwide.",
    },
    {
      title: "Our Values",
      desc: "Customer-first service • Transparency & honesty • Accessible, simple design • Continuous innovation",
    }
  ];

  const iconContent = [
    { 
      title: "Wide Selection", 
      desc: "Hotels, flights, events, and rentals — all in one platform.", 
      icon: <HotelIcon /> 
    },
    { 
      title: "Transparent Pricing", 
      desc: "No hidden fees. You always know exactly what you're paying for.", 
      icon: <MoneyIcon /> 
    },
    { 
      title: "Convenient & Fast", 
      desc: "Book instantly and manage everything from a clean dashboard.", 
      icon: <ClockIcon /> 
    },
  ];

  const imageContent = [
    { img: marketImg, alt: "Global Travel Network" },
    { img: flagsImg, alt: "International Destinations" }
  ];

  const carouselImages = [
    { img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80", alt: "Global Reach" },
    { img: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80", alt: "Endless Destination" },
    { img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80", alt: "Seamless Booking" },
    { img: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80", alt: "Journey Ready" },
    { img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80", alt: "Boundless Adventures" },
    { img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", alt: "Worldwide Access" }
  ];

  // Parallax
  const parallax1 = scrollY * 0.08;
  const parallax2 = scrollY * 0.05;

  return (
    <div style={{
      backgroundColor: "#ffffff",
      padding: "5rem 0",
      position: "relative",
      overflow: "hidden"
    }}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.7s ease-out forwards;
        }
        .scroll-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .scroll-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .slide-in-left {
          opacity: 0;
          transform: translateX(-30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .slide-in-left.visible {
          opacity: 1;
          transform: translateX(0);
        }
        .slide-in-right {
          opacity: 0;
          transform: translateX(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .slide-in-right.visible {
          opacity: 1;
          transform: translateX(0);
        }
        .scale-in {
          opacity: 0;
          transform: scale(0.9);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .scale-in.visible {
          opacity: 1;
          transform: scale(1);
        }
        .carousel-track {
          animation: scroll 30s linear infinite;
        }
        .carousel-track:hover {
          animation-play-state: paused;
        }
        .delay-1 { animation-delay: 0.15s; transition-delay: 0.1s; }
        .delay-2 { animation-delay: 0.3s; transition-delay: 0.2s; }
        .delay-3 { animation-delay: 0.45s; transition-delay: 0.3s; }
        .delay-4 { animation-delay: 0.6s; transition-delay: 0.4s; }
        .delay-5 { animation-delay: 0.75s; transition-delay: 0.5s; }
        .delay-6 { animation-delay: 0.9s; transition-delay: 0.6s; }
        .delay-7 { animation-delay: 1.05s; transition-delay: 0.7s; }
      `}</style>

      {/* FOR background gradient */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "50%",
        background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
        pointerEvents: "none"
      }} />

      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0 2rem",
        position: "relative",
        zIndex: 1
      }}>

        {/* HERO SECTION */}
        <div style={{
          textAlign: "center",
          maxWidth: "900px",
          margin: "0 auto 5rem",
          padding: "2rem 0"
        }}>
          <div className="fade-in-up">
            <h1 style={{
              fontWeight: 700,
              marginBottom: "1.5rem",
              lineHeight: 1.2,
              color: "#1e293b",
              fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
              letterSpacing: "-0.02em"
            }}>
              A smarter way to{" "}
              <span style={{ 
                color: "#2563eb",
                position: "relative"
              }}>
                book everything
              </span>
            </h1>
            <p style={{
              fontSize: "1.25rem",
              color: "#64748b",
              lineHeight: 1.7,
              maxWidth: "700px",
              margin: "0 auto"
            }}>
              We built this platform to make booking easier, faster, and more transparent — no matter where you're going or what you need.
            </p>
          </div>
        </div>

        {/* PARALLAX IMAGES SECTION - INFINITE CAROUSEL */}
        <div 
          data-index="carousel-section"
          className={`scroll-reveal ${visibleElements.has("carousel-section") ? "visible" : ""}`}
          style={{
            width: "100%",
            overflow: "hidden",
            marginBottom: "6rem",
            padding: "2rem 0"
          }}>
          <div className="carousel-track" style={{
            display: "flex",
            gap: "2rem",
            width: "fit-content"
          }}>
            {/* For the Carousel Loop*/}
            {[...carouselImages, ...carouselImages].map((item, index) => (
              <div 
                key={index}
                style={{
                  position: "relative",
                  borderRadius: "1rem",
                  overflow: "hidden",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                  height: "350px",
                  minWidth: "500px",
                  flexShrink: 0,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.08)";
                }}>
                <img 
                  src={item.img} 
                  alt={item.alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block"
                  }}
                />
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "1.5rem",
                  background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                  color: "white"
                }}>
                  <h3 style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    margin: 0
                  }}>{item.alt}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WHY CHOOSE US */}
        <div 
          data-index="why-section"
          className={`scroll-reveal ${visibleElements.has("why-section") ? "visible" : ""}`}
          style={{
            textAlign: "center",
            marginBottom: "4rem"
          }}>
          <h2 style={{
            fontWeight: 700,
            marginBottom: "1rem",
            color: "#1e293b",
            fontSize: "clamp(2rem, 4vw, 2.5rem)",
            letterSpacing: "-0.01em"
          }}>
            Why Choose Us
          </h2>
          <p style={{
            fontSize: "1.125rem",
            color: "#64748b",
            maxWidth: "600px",
            margin: "0 auto 3rem"
          }}>
            Built for modern travelers who value simplicity, transparency, and reliability.
          </p>
        </div>

        {/* ICON CARDS */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          marginBottom: "6rem"
        }}>
          {iconContent.map((item, index) => (
            <div 
              key={index}
              data-index={`icon-${index}`}
              className={`scale-in delay-${index + 1} ${visibleElements.has(`icon-${index}`) ? "visible" : ""}`}
              style={{
                backgroundColor: "#ffffff",
                padding: "2.5rem",
                borderRadius: "1rem",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                transition: "all 0.3s ease",
                cursor: "default"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)";
                e.currentTarget.style.borderColor = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}>
              <div style={{
                backgroundColor: "#eff6ff",
                color: "#2563eb",
                padding: "1.25rem",
                borderRadius: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "rotate(5deg) scale(1.1)";
                e.currentTarget.style.backgroundColor = "#2563eb";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "rotate(0deg) scale(1)";
                e.currentTarget.style.backgroundColor = "#eff6ff";
                e.currentTarget.style.color = "#2563eb";
              }}>
                {item.icon}
              </div>
              <h3 style={{
                fontWeight: 600,
                marginBottom: "0.75rem",
                color: "#1e293b",
                fontSize: "1.25rem"
              }}>
                {item.title}
              </h3>
              <p style={{
                fontSize: "1rem",
                color: "#64748b",
                lineHeight: 1.6,
                margin: 0
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* MISSION/VISION/VALUES */}
        <div 
          data-index="mission-section"
          className={`scroll-reveal ${visibleElements.has("mission-section") ? "visible" : ""}`}
          style={{
            backgroundColor: "#f8fafc",
            padding: "5rem 2rem",
            borderRadius: "1.5rem",
            margin: "0 -2rem"
          }}>
          <h2 style={{
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "1rem",
            color: "#1e293b",
            fontSize: "clamp(2rem, 4vw, 2.5rem)",
            letterSpacing: "-0.01em"
          }}>
            Our Mission, Vision & Values
          </h2>
          <p style={{
            fontSize: "1.125rem",
            color: "#64748b",
            textAlign: "center",
            maxWidth: "700px",
            margin: "0 auto 4rem"
          }}>
            Guiding principles that shape everything we do.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
            maxWidth: "1200px",
            margin: "0 auto"
          }}>
            {content.map((item, index) => (
              <div 
                key={index}
                data-index={`mvv-${index}`}
                className={`scroll-reveal delay-${index + 1} ${visibleElements.has(`mvv-${index}`) ? "visible" : ""}`}
                style={{
                  backgroundColor: "#ffffff",
                  padding: "2.5rem",
                  borderRadius: "1rem",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
                }}>
                <div style={{
                  width: "48px",
                  height: "4px",
                  backgroundColor: "#2563eb",
                  borderRadius: "2px",
                  marginBottom: "1.5rem",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.width = "64px";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.width = "48px";
                }} />
                <h3 style={{
                  fontWeight: 600,
                  marginBottom: "1rem",
                  color: "#1e293b",
                  fontSize: "1.5rem"
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: "1rem",
                  color: "#64748b",
                  lineHeight: 1.7,
                  margin: 0
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutContent;