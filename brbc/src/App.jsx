// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import LandingPage from './pages/landingPage/LandingPage';
import Signup from './pages/Signup/Signup';
import ViewTicket from './pages/ViewTicket/ViewTicket';
import Signin from './pages/Signin/Signin';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/" element={<LandingPage/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route 
          path="/viewTicket" 
          element={
            <ProtectedRoute>
              <ViewTicket />
            </ProtectedRoute>
          } 
        />
        <Route path="/signin" element={<Signin/>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
