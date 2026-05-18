import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Home from './pages/Home';
import Login from './pages/Login';
import Scratch from './pages/Scratch';
import Result from './pages/Result';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-karate-dark font-sans text-white relative">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-karate-red/10 via-karate-dark to-karate-darker -z-10" />
        
        <Navbar />
        
        <main className="pt-20 min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/scratch" element={<Scratch />} />
            <Route path="/result" element={<Result />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        <FloatingWhatsApp />
      </div>
    </Router>
  );
}

export default App;
