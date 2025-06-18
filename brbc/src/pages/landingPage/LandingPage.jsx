import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Paper, Modal } from '@mui/material';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import conferenceFlyer from '../../assets/conferencePics/conferencePic.jpeg'; // Updated path
import './landingPage.scss';

// Import images
import conferencePic from '../../assets/conferencePics/conferencePic.jpeg';
import cooks2 from '../../assets/conferencePics/cooks2.jpeg';
import cooks from '../../assets/conferencePics/cooks.jpeg';
import boera from '../../assets/conferencePics/boera.jpeg';
import conrad from '../../assets/conferencePics/conrad.jpeg';
import attendees3 from '../../assets/conferencePics/attendees3.jpeg';
import attendees2 from '../../assets/conferencePics/attendees2.jpeg';
import attendees from '../../assets/conferencePics/attendees.jpeg';
import groupPic from '../../assets/conferencePics/groupPic.jpeg';
import seated from '../../assets/conferencePics/seated.jpeg';

const images = [
    // conferencePic,
    cooks2,
    cooks,
    boera,
    conrad,
    attendees3,
    attendees2,
    attendees,
    groupPic,
    seated
];

const LandingPage = () => {
  const [isFlyerOpen, setIsFlyerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [shuffledImages, setShuffledImages] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Shuffle images on component mount
    setShuffledImages(shuffleArray([...images]));
  }, []);

  useEffect(() => {
    if (shuffledImages.length === 0) return;

    let index = 0;
    setCurrentImage(shuffledImages[index]);

    const intervalId = setInterval(() => {
      // Start fade out
      setIsVisible(false);
      
      // After fade out, change image and fade in
      setTimeout(() => {
        index = (index + 1) % shuffledImages.length;
        setCurrentImage(shuffledImages[index]);
        setIsVisible(true);
      }, 200); // Match this with CSS transition duration
    }, 5000);

    return () => clearInterval(intervalId);
  }, [shuffledImages]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  const handleOpenFlyer = () => setIsFlyerOpen(true);
  const handleCloseFlyer = () => setIsFlyerOpen(false);

  return (
    <Box className="landingPage">
      {/* Left side - Hero section */}
      <Box className="heroSection">
        <Typography variant="h1" className="mainTitle">
          BRBC Conference 2025
        </Typography>
        <Typography variant="h4" className="subtitle">
          A Journey of Faith & Fellowship
        </Typography>
        <Typography variant="body1" className="description">
          Join us for an extraordinary gathering of believers, 
          where we'll worship, learn, and grow together in faith.
        </Typography>
        <Button 
          variant="contained" 
          className="flyerButton"
          onClick={handleOpenFlyer}
        >
          View Flyer
        </Button>
      </Box>

      {/* Middle - Image Carousel */}
      <Box className="carouselSection">
        <Box className="image-carousel">
          {currentImage && (
            <img 
              src={currentImage} 
              alt="Conference Gallery" 
              className={`carousel-image ${isVisible ? 'visible' : 'hidden'}`}
            />
          )}
        </Box>
      </Box>

      {/* Right side - Form container */}
      <Paper elevation={3} className="formContainer">
        <Box className="formContent">
          <Typography variant="h4" className="formTitle" gutterBottom>
            Join Us
          </Typography>
          <Typography variant="body1" className="formSubtitle" paragraph>
            Be part of this transformative experience
          </Typography>
          <Button 
            component={Link} 
            to="/signup"
            variant="contained" 
            color="primary" 
            size="large"
            className="registerButton"
            fullWidth
          >
            Register Now
          </Button>
          <Typography variant="body2" className="loginPrompt">
            Already registered? <Link to="/signin" className="loginLink">Sign in</Link>
          </Typography>
        </Box>
      </Paper>

      {/* Custom Flyer Modal */}
      {isFlyerOpen && (
        <Box 
          className="customFlyerModalOverlay"
          onClick={handleCloseFlyer} // Close on overlay click
        >
          <Box 
            className="customFlyerModalContent"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside content from closing
          >
      
            <img 
              src={conferenceFlyer} 
              alt="BRBC Conference Flyer" 
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default LandingPage;
