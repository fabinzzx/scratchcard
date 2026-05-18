import React, { useEffect, useState } from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { QRCodeSVG } from 'qrcode.react';
import { MessageCircle, CheckCircle, IndianRupee, ArrowRight } from 'lucide-react';
import { getUser, calculateFees } from '../lib/db';

export default function Result() {
  const location = useLocation();
  const uid = location.state?.uid;
  
  const [user, setUser] = useState(null);
  const [fees, setFees] = useState(null);
  const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    
    const fetchUser = async () => {
      if (uid) {
        const userData = await getUser(uid);
        setUser(userData);
        if (userData?.reward) {
          setFees(calculateFees(userData.reward));
        }
      }
      setLoading(false);
    };
    
    fetchUser();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [uid]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-karate-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!uid || !user) {
    return <Navigate to="/" replace />;
  }

  const isWinner = user.reward.type !== 'none';
  const whatsappMessage = isWinner 
    ? `Hello! My name is ${user.name}. I won ${user.reward.label} discount in the Scratch & Win campaign! My code is ${user.couponCode}. I want to take a new admission.`
    : `Hello! My name is ${user.name}. I participated in the Scratch & Win campaign. I want to take a new admission.`;

  const whatsappUrl = `https://wa.me/+918590194256?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 relative z-10 py-12">
      {isWinner && <Confetti width={windowDimensions.width} height={windowDimensions.height} recycle={false} numberOfPieces={500} />}
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-2xl p-6 md:p-10 relative overflow-hidden"
      >
        <div className="text-center mb-8">
          {isWinner ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.3 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-karate-gold/20 text-karate-gold mb-4 shadow-[0_0_30px_rgba(255,215,0,0.4)]"
              >
                <CheckCircle size={40} />
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-black mb-2 glow-text text-karate-gold">CONGRATULATIONS!</h2>
              <p className="text-xl text-white">You won <strong className="text-karate-red text-2xl">{user.reward.label}</strong></p>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-black mb-2 text-gray-400">Oh Snap!</h2>
              <p className="text-xl text-gray-300">Better luck next time. You can still join our academy!</p>
            </>
          )}
        </div>

        {fees && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-400 border-b border-white/10 pb-2">Fee Structure Breakdown</h3>
              
              <div className="flex justify-between items-center bg-black/30 p-3 rounded-lg">
                <span className="text-gray-300">Admission Fee</span>
                <div className="text-right">
                  {isWinner && fees.originalAdmission !== fees.admission && (
                    <span className="text-red-400 line-through text-xs mr-2">₹{fees.originalAdmission}</span>
                  )}
                  <span className="font-bold text-white flex items-center justify-end"><IndianRupee size={14} />{fees.admission}</span>
                </div>
              </div>

              <div className="flex justify-between items-center bg-black/30 p-3 rounded-lg">
                <span className="text-gray-300">Monthly Fee</span>
                <div className="text-right">
                  {isWinner && fees.originalMonthly !== fees.monthly && (
                    <span className="text-red-400 line-through text-xs mr-2">₹{fees.originalMonthly}</span>
                  )}
                  <span className="font-bold text-white flex items-center justify-end">
                    <IndianRupee size={14} />
                    {fees.monthly} 
                    {fees.monthlyFreeMonths ? <span className="text-karate-gold text-xs ml-1">(Free for {fees.monthlyFreeMonths} mos)</span> : null}
                  </span>
                </div>
              </div>

              {isWinner && fees.savings > 0 && (
                <div className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-center shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                  <span className="block text-green-400 text-sm font-bold mb-1">TOTAL ESTIMATED SAVINGS</span>
                  <span className="text-2xl font-black text-green-400 flex items-center justify-center"><IndianRupee size={20} />{fees.savings}</span>
                </div>
              )}
            </div>

            {isWinner && (
              <div className="flex flex-col items-center justify-center bg-white/5 rounded-xl p-6 border border-karate-gold/30">
                <h3 className="text-sm font-bold text-gray-400 mb-4 tracking-widest uppercase">Verification Code</h3>
                <div className="bg-white p-3 rounded-xl mb-4">
                  <QRCodeSVG value={user.couponCode} size={120} />
                </div>
                <div className="bg-black/50 px-4 py-2 rounded-lg border border-white/10 font-mono text-xl tracking-widest text-karate-gold glow-text">
                  {user.couponCode}
                </div>
                <p className="text-xs text-center text-gray-500 mt-4">Show this code at the academy or send via WhatsApp to claim.</p>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col space-y-4 pt-6 border-t border-white/10">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)]"
          >
            <MessageCircle className="mr-2 h-6 w-6" />
            Claim via WhatsApp
          </a>
          <Link
            to="/"
            className="w-full flex items-center justify-center py-3 px-6 text-sm font-bold text-gray-400 hover:text-white transition-colors"
          >
            Return to Home <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
