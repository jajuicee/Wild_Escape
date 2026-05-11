import React, { createContext } from "react";
import { Box } from "@mui/material";
// 1. Import Framer Motion
import { motion, useScroll, useTransform } from "framer-motion";

import HeroSection from "../components/HeroSection";
import DiscoverSection from "../components/DiscoverSection";
import PriceOfferCard from "../components/PriceOfferCard";

export const ContentContext = createContext([]);

// 2. CREATE THE ANIMATION WRAPPER
// This handles the "Fade In + Slide Up" effect
const RevealOnScroll = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 75 }}      // Start: Invisible and 75px down
      whileInView={{ opacity: 1, y: 0 }}   // End: Visible and in original position
      viewport={{ once: true, amount: 0.1 }} // Trigger: When 10% of component is visible
      transition={{ duration: 0.8, ease: "easeOut" }} // Speed: 0.8 seconds, smooth end
    >
      {children}
    </motion.div>
  );
};

const HomePage = () => {
  const content = [
    { title: "Easy Booking", desc: "Reserve your trips quickly and hassle-free." },
    { title: "Smart Travel Tools", desc: "Get insights and recommendations for your journey." },
    { title: "User-Friendly", desc: "Navigate the platform easily with an intuitive interface." },
  ];

  // (Optional) Keep Hero Parallax for the best effect
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <ContentContext.Provider value={{ content }}>
      
      {/* Hero Section (Parallax Background) */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <motion.div style={{ y: yHero }}>
           <HeroSection />
        </motion.div>
      </Box>

      {/* Main Content (Fades in as you scroll) */}
      <Box 
        sx={{ 
          position: "relative", 
          zIndex: 10, 
          bgcolor: "background.paper",
          pt: 4 
        }}
      >
        {/* 3. WRAP YOUR SECTIONS HERE */}
        <RevealOnScroll>
           <DiscoverSection />
        </RevealOnScroll>
        
        {/* I'll wrap something here later:
        <RevealOnScroll>
           <PriceOfferCard />
        </RevealOnScroll> 
        */}

      </Box>

    </ContentContext.Provider>
  );
};

export default HomePage;