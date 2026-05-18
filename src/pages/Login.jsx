import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, User, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { hasPlayed, saveUser, getUser, isPhoneUsedByAnotherUser } from '../lib/db';
import { auth, googleProvider, signInWithPopup } from '../lib/firebase';

export default function Login() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [step, setStep] = useState(1); // 1: Google Auth, 2: Collect Info
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [firebaseUser, setFirebaseUser] = useState(null);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);

    if (!auth || !googleProvider) {
      setError('Firebase is not configured properly.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setFirebaseUser(user);
      
      // Try to get existing user from DB
      const existingUser = await getUser(user.uid);
      if (existingUser && existingUser.phone) {
        // We already have their info
        if (await hasPlayed(user.uid)) {
          navigate('/result', { state: { uid: user.uid } });
        } else {
          navigate('/scratch', { state: { uid: user.uid } });
        }
      } else {
        // Pre-fill name if available
        if (user.displayName) setName(user.displayName);
        setStep(2);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    if (name.length < 2 || phone.length !== 10 || !age) {
      setError('Please fill in all details correctly.');
      return;
    }
    
    setIsLoading(true);
    
    if (await isPhoneUsedByAnotherUser(firebaseUser.uid, phone)) {
      setError('This mobile number has already been used to claim a scratch card.');
      setIsLoading(false);
      return;
    }

    setError('');

    // Save User Data
    await saveUser({ 
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name, 
      phone,
      age
    });

    if (await hasPlayed(firebaseUser.uid)) {
      navigate('/result', { state: { uid: firebaseUser.uid } });
    } else {
      navigate('/scratch', { state: { uid: firebaseUser.uid } });
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 relative z-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-karate-red rounded-tl-2xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-karate-gold rounded-br-2xl opacity-50"></div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-karate-dark border border-white/10 mb-4">
            <ShieldCheck className="text-karate-gold" size={32} />
          </div>
          <h2 className="text-3xl font-bold mb-2">{step === 1 ? 'Sign In' : 'Complete Profile'}</h2>
          <p className="text-gray-400 text-sm">
            {step === 1 ? 'Sign in with Google to play and win!' : 'Just a few more details before you scratch!'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        {step === 1 ? (
          <div className="space-y-5">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-white/20 rounded-xl shadow-sm text-base font-bold text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-karate-dark focus:ring-white transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                <path d="M1 1h22v22H1z" fill="none"/>
              </svg>
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSaveInfo} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-white/20 rounded-xl bg-black/60 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-karate-red focus:border-transparent transition-all shadow-inner"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-300 mb-1">Age</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="number"
                    required
                    min="3"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-white/20 rounded-xl bg-black/60 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-karate-red focus:border-transparent transition-all shadow-inner"
                    placeholder="Age"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Mobile Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="block w-full pl-10 pr-3 py-3 border border-white/20 rounded-xl bg-black/60 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-karate-red focus:border-transparent transition-all shadow-inner"
                    placeholder="Mobile number"
                    maxLength={10}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 mt-2 border border-transparent rounded-xl shadow-sm text-base font-bold text-black bg-karate-gold hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-karate-dark focus:ring-karate-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Saving...' : 'Play Now'}
              {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
