import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScratchCardCanvas from '../components/ScratchCardCanvas';
import { getUser, hasPlayed, generateReward, saveUser } from '../lib/db';

export default function Scratch() {
  const location = useLocation();
  const navigate = useNavigate();
  const uid = location.state?.uid;
  
  const [reward, setReward] = useState(null);

  useEffect(() => {
    if (!uid) return;
    
    const initScratch = async () => {
      // Anti-cheat check
      if (await hasPlayed(uid)) {
        navigate('/result', { state: { uid }, replace: true });
        return;
      }

      // Load or generate reward
      const user = await getUser(uid);
      if (user) {
        if (user.reward) {
          setReward(user.reward);
        } else {
          const newReward = generateReward();
          setReward(newReward);
          
          // Save the generated reward immediately so they can't refresh for a different one
          await saveUser({
            ...user,
            reward: newReward,
            couponCode: newReward.type !== 'none' ? `KARATE${Math.floor(1000 + Math.random() * 9000)}` : null
          });
        }
      }
    };

    initScratch();
  }, [uid, navigate]);

  if (!uid) {
    return <Navigate to="/login" replace />;
  }

  const handleComplete = async () => {
    // Mark as played only after they actually finish scratching
    const user = await getUser(uid);
    if (user) {
      await saveUser({
        ...user,
        alreadyPlayed: true
      });
    }

    setTimeout(() => {
      navigate('/result', { state: { uid }, replace: true });
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-2 glow-text">Scratch Your Card</h2>
        <p className="text-gray-300">You only have ONE chance. Scratch to reveal your prize!</p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="relative p-2 rounded-2xl bg-gradient-to-br from-karate-gold to-yellow-600 shadow-[0_0_30px_rgba(255,215,0,0.3)]"
      >
        <div className="bg-karate-dark p-4 rounded-xl">
          {reward && (
            <ScratchCardCanvas
              width={300}
              height={300}
              onComplete={handleComplete}
              finishPercent={40}
              image="/logo.png"
            >
              {/* This is what's revealed under the scratch area */}
              <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-lg p-6 text-center border-4 border-karate-red border-dashed">
                {reward.type !== 'none' ? (
                  <>
                    <span className="text-karate-red font-bold text-lg mb-2">YOU WON!</span>
                    <h3 className="text-4xl font-black text-black mb-2">{reward.label}</h3>
                    <p className="text-gray-600 text-sm font-semibold">On New Admission</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-3xl font-black text-gray-800 mb-2">BETTER LUCK</h3>
                    <h3 className="text-3xl font-black text-gray-800">NEXT TIME</h3>
                  </>
                )}
              </div>
            </ScratchCardCanvas>
          )}
        </div>
      </motion.div>
      
      <p className="mt-8 text-sm text-gray-500 flex items-center gap-2">
        <span>☝️</span> Use your finger or mouse to scratch the card
      </p>
    </div>
  );
}
