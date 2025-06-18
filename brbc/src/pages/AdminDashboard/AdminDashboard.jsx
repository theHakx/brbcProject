import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import UserTable from '../../components/Usertable/Usertable';
import { Typography, Box, CircularProgress, Alert } from '@mui/material';
import './AdminDashboard.scss';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get('/admin/users');
        setUsers(res.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box className="admin-dashboard-page">
      <Typography variant="h4" gutterBottom component="h1">
        Admin Dashboard
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress color="inherit" />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && users && <UserTable users={users} />}
    </Box>
  );
};

export default AdminDashboard;
