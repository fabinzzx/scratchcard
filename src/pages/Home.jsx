import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Users, MapPin, Gift } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden">
      {/* Background Japanese Pattern (Optional subtle overlay) */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full border border-karate-gold/30 bg-karate-gold/10 text-karate-gold text-sm font-semibold tracking-wider"
          >
            🔥 NEW ADMISSION EXCLUSIVE OFFER
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight glow-text leading-tight"
          >
            SCRATCH & WIN <br />
            <span className="text-karate-red glow-box-red inline-block px-2 mt-2">KARATE OFFER</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Begin your martial arts journey with Okinavan Shito Ryu Karate Academy. Win up to <strong className="text-white">100% OFF on Admission & 1st Month Fees</strong> or <strong className="text-white">3 Months Free</strong>!
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col gap-6 items-center"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-lg">
              <Link 
                to="/login"
                className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-karate-red to-red-700 text-white font-bold text-lg rounded-full shadow-[0_0_20px_rgba(230,0,0,0.4)] hover:scale-105 hover:shadow-[0_0_30px_rgba(230,0,0,0.6)] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Gift size={24} />
                Play Now & Win
              </Link>
              <a 
                href="https://www.okinavanshitoryukarate.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/20 hover:border-white/40 text-white font-bold text-lg rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Visit Website
              </a>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-400 mt-2 max-w-md mx-auto leading-relaxed border-t border-white/10 pt-4 w-full">
              📍 <strong className="text-karate-gold">Redemption Location:</strong> Pattam Dojo, Cherukadappuram <br />
              📅 <strong className="text-karate-gold">Validity:</strong> Offer valid till 10/06/2026 (June 10)
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24"
        >
          <div className="glass-card p-8 text-center group hover:bg-white/10 transition-colors">
            <div className="w-16 h-16 mx-auto bg-karate-red/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Trophy className="text-karate-red" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Expert Training</h3>
            <p className="text-gray-400">Learn authentic Okinavan Shito Ryu from certified masters.</p>
          </div>
          
          <div className="glass-card p-8 text-center group hover:bg-white/10 transition-colors">
            <div className="w-16 h-16 mx-auto bg-karate-gold/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="text-karate-gold" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">All Ages Welcome</h3>
            <p className="text-gray-400">Programs designed for kids, teens, and adults of all skill levels.</p>
          </div>
          
          <div className="glass-card p-8 text-center group hover:bg-white/10 transition-colors">
            <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MapPin className="text-blue-500" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Multiple Dojos</h3>
            <p className="text-gray-400">Convenient locations fully equipped for professional training.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
