import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-karate-dark/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          {/* Logo */}
          <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(230,0,0,0.3)] overflow-hidden p-1">
            <img src="/logo.png" alt="Okinavan Shito Ryu Logo" className="w-full h-full object-contain" onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150?text=Logo"; }} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-white">OKINAVAN SHITO RYU</h1>
            <p className="text-xs text-karate-gold font-medium tracking-widest">KARATE ACADEMY</p>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <span className="text-sm text-gray-300">New Admissions Only</span>
          <Link 
            to="/login"
            className="px-6 py-2 bg-gradient-to-r from-karate-gold to-yellow-600 text-black font-bold rounded-full hover:scale-105 transition-transform duration-300 glow-box-gold"
          >
            Claim Offer
          </Link>
        </div>
      </div>
    </nav>
  );
}
