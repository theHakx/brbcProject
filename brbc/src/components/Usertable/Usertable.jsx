import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Button, Stack
} from '@mui/material';
import axiosInstance from '../../utils/axios';

const UserTable = ({ users: initialUsers = [] }) => {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Update users when prop changes
  React.useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  // Clear messages after 3 seconds
  React.useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Filtered list based on search input
  const filteredUsers = users.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(query.toLowerCase()) ||
      user.email?.toLowerCase().includes(query.toLowerCase())
  );

  // Handlers
  const handleApprove = async (id) => {
    try {
      await axiosInstance.put(`/admin/approve/${id}`);
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isPaid: true } : user
        )
      );
      setError(null);
    } catch (err) {
      console.error('Approval failed:', err);
      setError('Failed to approve user. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await axiosInstance.delete(`/admin/delete/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
      setSuccess(res.data.msg || 'User deleted successfully');
      setError(null);
    } catch (err) {
      console.error('Delete failed:', err);
      setError(err.response?.data?.msg || 'Failed to delete user. Please try again.');
      setSuccess(null);
    }
  };

  const handleView = (user) => {
    alert(`User:\nName: ${user.fullName}\nEmail: ${user.email}\nTicket: ${user.ticket}`);
  };

  return (
    <Paper sx={{ padding: 2 }}>
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#ffebee', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ color: 'green', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
          {success}
        </div>
      )}
      <TextField
        label="Search by name or email"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: '#1976d2' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Name</TableCell>
              <TableCell sx={{ color: 'white' }}>Email</TableCell>
              <TableCell sx={{ color: 'white' }}>Phone Number</TableCell>
              <TableCell sx={{ color: 'white' }}>Ticket</TableCell>
              <TableCell sx={{ color: 'white' }}>Paid</TableCell>
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.ticket}</TableCell>
                <TableCell>{user.isPaid ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" onClick={() => handleView(user)}>
                      View
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      disabled={user.isPaid}
                      onClick={() => handleApprove(user._id)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default UserTable;
