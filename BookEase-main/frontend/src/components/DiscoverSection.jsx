import React, { useRef, useContext, useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Chip } from "@mui/material";

// --- MOCKS ---
const ContentContext = React.createContext({
  content: [
    { title: "Plan Trips", description: "Create detailed itineraries with drag-and-drop ease.", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "Explore Gems", description: "Find hidden spots off the beaten path.", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "Book Stays", description: "From cozy treehouses to luxury resorts.", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "Travel Safe", description: "Verified local guides and real-time safety alerts.", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  ]
});

const FeatureCards = ({ content, active }) => (
  <Card sx={{ 
    width: '100%', 
    height: '100%', 
    borderRadius: 4, 
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden', 
    backgroundColor: '#fff',
    position: 'relative', 
  }}>
    {/* Image Wrapper */}
    <Box sx={{ 
      height: active ? '55%' : '70%', 
      overflow: 'hidden', 
      position: 'relative',
      transition: 'height 0.5s ease'
    }}>
      <CardMedia 
        component="img" 
        height="100%" 
        image={content.image} 
        alt={content.title}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: active ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)', 
        }}
      />
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '50%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
        pointerEvents: 'none'
      }} />
    </Box>

    <CardContent sx={{ 
      p: 3, 
      flexGrow: 1, 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: active ? 'flex-start' : 'center', 
      textAlign: active ? 'left' : 'center',
      transition: 'all 0.5s ease'
    }}>
      <Typography 
        variant="h5" 
        fontWeight="bold" 
        sx={{ 
          fontFamily: "'Montserrat', sans-serif",
          whiteSpace: 'nowrap', 
          mb: 1
        }}
      >
        {content.title}
      </Typography>
      
      <Box sx={{ 
        opacity: active ? 1 : 0, 
        maxHeight: active ? '100px' : '0px',
        transform: active ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.5s ease',
        overflow: 'hidden'
      }}>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {content.description}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

function DiscoverSection() {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null); 
  const { content } = useContext(ContentContext);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 } // Increased slightly so it triggers when more is visible
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, md: 4 },
        py: 8,
        overflow: 'hidden'
      }}
    >
      {/* Header Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '800px',
          mb: 6,
          // Header Animation
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(-20px)",
          transition: "opacity 1s ease-out, transform 1s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
        <Chip 
          label="The Journey Begins" 
          size="small"
          sx={{ mb: 2, bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 600, letterSpacing: 1 }} 
        />
        
        <Typography
          component="h1"
          sx={{
            fontWeight: 700,
            mb: '1.5rem',
            lineHeight: 1.2,
            color: 'rgb(30, 41, 59)',
            fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
            letterSpacing: '-0.02em',
            textAlign: "center",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
          }}
        >
          Discover Wild<span style={{ color: 'rgb(59, 130, 246)', position: 'relative' }}>Escape</span>
        </Typography>

        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            lineHeight: 1.8,
            fontSize: { xs: "1rem", md: "1.125rem" },
            fontFamily: "'Roboto', sans-serif",
            color: "#666",
            maxWidth: '700px' 
          }}
        >
          WildEscape is your ultimate travel companion. Effortlessly plan trips, explore amazing destinations, organize itineraries, and book accommodations that fit your style.
        </Typography>
      </Box>

      {/* Accordion Container */}
      <Box
        onMouseLeave={() => setHoveredIndex(null)}
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: "1200px",
          height: { xs: "auto", md: "450px" }, 
          flexDirection: { xs: "column", md: "row" }, 
          gap: 2,
        }}
      >
        {content.map((item, idx) => {
          const isHovered = hoveredIndex === idx;
          const isDimmed = hoveredIndex !== null && !isHovered;

          // Stagger Calculation: Base delay + (Index * Step)
          const delay = `${idx * 150 + 200}ms`; 

          return (
            <Box 
              key={idx} 
              onMouseEnter={() => setHoveredIndex(idx)}
              sx={{ 
                flex: { xs: '1', md: isHovered ? 3.5 : 1 },
                height: { xs: '300px', md: '100%' }, 
                width: '100%',
                cursor: 'pointer',
                
                // --- ANIMATION LOGIC MOVED HERE ---
                opacity: isVisible ? (isDimmed ? 0.5 : 1) : 0,
                filter: isDimmed ? 'blur(2px) grayscale(80%)' : 'none',
                transform: isVisible 
                  ? (isDimmed ? 'scale(0.98)' : 'scale(1) translateY(0)') 
                  : 'translateY(100px)', // Starts lower for a more dramatic entrance
                
                // We combine the entrance transition with the hover transition
                transition: `
                  opacity 0.8s ease-out ${isVisible ? delay : '0ms'}, 
                  transform 0.8s cubic-bezier(0.17, 0.55, 0.55, 1) ${isVisible ? delay : '0ms'},
                  flex 0.5s cubic-bezier(0.25, 1, 0.5, 1),
                  filter 0.3s ease
                `,
              }}
            >
              <FeatureCards content={item} active={isHovered} />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}


export default function App() {
  return (
    <DiscoverSection />
  );
}