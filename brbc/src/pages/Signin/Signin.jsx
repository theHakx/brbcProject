import React, { useState, useContext } from 'react';
import { TextField, Button, Paper, Typography, Stack, FormControlLabel, Checkbox, Container, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Signin.scss';

const Signin = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
    isAdmin: false
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isAdmin' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!formData.phoneNumber || !formData.password) {
      setMessage('Please fill in both fields');
      setLoading(false);
      return;
    }

    try {
      // If admin login, use admin endpoint
      const endpoint = formData.isAdmin 
        ? 'http://localhost:5000/api/admin/login'
        : 'http://localhost:5000/api/user/login';

      const res = await axios.post(endpoint, {
        phoneNumber: formData.phoneNumber,
        password: formData.password
      });

      console.log('Login response:', res.data); // Debug log

      // Save the token to local storage based on user type
      if (formData.isAdmin) {
        localStorage.setItem('adminToken', res.data.token); // Assuming admin token is stored as 'adminToken'
      } else {
        localStorage.setItem('userToken', res.data.token); // Save user token as 'userToken'
      }

      // Use the auth context to handle login
      await login(res.data, formData.isAdmin); // Pass the entire response data
      
      setMessage('✅ Login successful!');
      
      // Add a small delay to ensure state is updated
      setTimeout(() => {
        // Redirect based on user type
        if (formData.isAdmin) {
          console.log('Redirecting to admin dashboard...'); // Debug log
          navigate('/admin', { replace: true });
        } else {
          navigate('/viewTicket', { replace: true });
        }
      }, 100);

    } catch (err) {
      console.error('Login error:', err);
      setMessage(err.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="signin-page">
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
            Sign In
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="isAdmin"
                    checked={formData.isAdmin}
                    onChange={handleChange}
                    disabled={loading}
                  />
                }
                label="Login as Admin"
              />
              <Button 
                variant="contained" 
                color="primary" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
              {message && (
                <Typography color={message.startsWith('✅') ? 'green' : 'error'}>
                  {message}
                </Typography>
              )}
            </Stack>
            <div className="siginInMessage">
              <h1>If you do not have an account signup <a href="/signup">here</a></h1>
            </div>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default Signin;
