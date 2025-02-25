import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Navbar from './Navbar'
import Browse from './Browse'
import MyPortfolio from './MyPortfolio'
import UserPortfolio from './UserPortfolio'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Redirect root to Browse page */}
        <Route path="/" element={<Navigate to="/browse" replace />} />
        
        {/* Main routes */}
        <Route path="/browse" element={<Browse />} />
        <Route path="/my-portfolio" element={<MyPortfolio />} />
        <Route path="/portfolio/:username" element={<UserPortfolio />} />
        
        {/* 404 Page - redirect to Browse */}
        <Route path="*" element={<Navigate to="/browse" replace />} />
      </Routes>
    </Router>
  );
}

export default App