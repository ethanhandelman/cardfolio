import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Browse from './pages/Browse'
import MyPortfolio from './pages/MyPortfolio'
import UserPortfolio from './pages/UserPortfolio'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/browse" replace />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/portfolio/:username" element={<UserPortfolio />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/my-portfolio" element={<MyPortfolio />} />
            {/* Add more protected routes here */}
          </Route>
          
          {/* 404 Page - redirect to Browse */}
          <Route path="*" element={<Navigate to="/browse" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App