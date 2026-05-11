// layouts/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Fade } from '@mui/material';
import NavBar from '../components/NavBar';
import SplashScreen from '../components/SplashScreen';

const MainLayout = () => {
  const [loading, setLoading] = useState(true); 
  const [showContent, setShowContent] = useState(false); 

  const handleSplashFinish = () => {
    setLoading(false);      
    setShowContent(true);  
  };

  return (
    <>
      {loading && <SplashScreen onFinish={handleSplashFinish} />}
      <Fade in={showContent} timeout={1000}>
        <div>
          {!loading && (
            <>
              <NavBar />
              <Outlet />
            </>
          )}
        </div>
      </Fade>
    </>
  );
};

export default MainLayout;
