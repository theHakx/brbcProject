import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Stack, Container, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.scss';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  const navigate = useNavigate();

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/user/register', formData);
      setMessage(res.data.msg);
      setFormData({ fullName: '', email: '', phoneNumber: '', password: '' });
      localStorage.setItem('userPhone', formData.phoneNumber);
      navigate('/viewTicket');

    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <Box className="signup-page">
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          className="formContainer"
        >
          <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit} >
            <Stack spacing={2}>
              <TextField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                required
              />
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
              <TextField
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                required
              />
              <Button variant="contained" color="primary" type="submit">
                Register
              </Button>
              {message && (
                <Typography color={message.includes('✅') ? 'green' : 'error'}>
                  {message}
                </Typography>
              )}
            </Stack>
            <div className="siginInMessage">
              <h1>Already have an account? Sign in <a href="/signin">here</a></h1>
            </div>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default Signup;
