// src/pages/ViewTicket.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Use standard axios
import { Typography, Box, CircularProgress, Alert, Paper, Grid, Button } from '@mui/material'; // Added Paper, Grid, Button
import './ViewTicket.scss'; // Import the new SCSS file

const ViewTicket = () => {
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      setLoading(true); // Set loading to true at the start of fetch
      setError(null); // Clear previous errors
      
      // Get the user token from local storage
      const userToken = localStorage.getItem('userToken'); // Assuming token is stored with this key

      if (!userToken) {
        setError('You need to be logged in to view your ticket.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/user/ticket', { // Use standard axios and the new user endpoint
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        setTicketData(response.data);
      } catch (err) {
        console.error('Error fetching user ticket:', err);
        // Display specific error message if available from backend
        setError(err.response?.data?.msg || 'Failed to fetch ticket details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket(); // Fetch ticket when component mounts or error/loading state changes (simplified dependency for now)
  }, []); // Empty dependency array means this effect runs only once on mount

   const handleDownloadPDF = async () => {
       const userToken = localStorage.getItem('userToken'); // Get the user token

       if (!userToken) {
           alert('You need to be logged in to download the ticket.');
           return;
       }

       try {
           const response = await axios.get('http://localhost:5000/api/user/ticketPDF', { // Call the new user PDF endpoint
               headers: {
                   Authorization: `Bearer ${userToken}`
               },
               responseType: 'blob', // Important for handling binary data like PDFs
           });

           // Create a blob from the response data
           const blob = new Blob([response.data], { type: 'application/pdf' });

           // Create a link element, set its href to the blob, and click it to trigger download
           const downloadUrl = window.URL.createObjectURL(blob);
           const link = document.createElement('a');
           link.href = downloadUrl;
           // Use the filename from the Content-Disposition header if available, otherwise default
           const contentDisposition = response.headers['content-disposition'];
           const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
           const filename = filenameMatch ? filenameMatch[1] : 'ticket.pdf';
           link.setAttribute('download', filename); 
           document.body.appendChild(link);
           link.click();
           link.remove(); // Clean up the temporary link and URL
           window.URL.revokeObjectURL(downloadUrl);

       } catch (err) {
           console.error('Error downloading ticket PDF:', err);
           alert('Failed to download ticket PDF. Please try again.');
       }
   };


  return (
    <Box className="view-ticket-page"> {/* Apply the main class */}
      <Typography variant="h4" gutterBottom component="h1"> {/* Adjust heading color if needed */}
        Ticket Details
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress color="inherit" /> {/* Adjust color if needed */}
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 4 }}> {/* Adjust color if needed */}
          {error}
        </Alert>
      )}

      {!loading && !error && ticketData && (
        <Paper className="ticket-container" elevation={3} sx={{ p: 3, mt: 4 }}> {/* Use Paper for better visual structure */}
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Conference Ticket
          </Typography>
          <Grid container spacing={2}> {/* Use Grid for layout */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body1"><strong>Full Name:</strong></Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">{ticketData.fullName}</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="body1"><strong>Email:</strong></Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">{ticketData.email}</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="body1"><strong>Phone:</strong></Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">{ticketData.phoneNumber}</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="body1"><strong>Ticket Number:</strong></Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">{ticketData.ticket}</Typography>
            </Grid>
             <Grid item xs={12} sm={6}> {/* Display payment status */}
              <Typography variant="body1"><strong>Payment Status:</strong></Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
               <Typography variant="body1">{ticketData.isPaid ? 'Approved ✅' : 'Pending ⏳'}</Typography>
            </Grid>
          </Grid>

           {/* Download PDF Button */}
           {ticketData.isPaid && ( // Only show button if paid
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleDownloadPDF} 
                    sx={{ mt: 4 }}
                >
                    Download Ticket PDF
                </Button>
           )}

        </Paper>
      )}
       {!loading && !error && !ticketData && (
        <Typography variant="body1" sx={{ mt: 4 }}>No ticket details available. Please ensure you are logged in and your payment is approved.</Typography>
      )}
    </Box>
  );
};

export default ViewTicket;
