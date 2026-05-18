import React, { useState, useEffect } from 'react';
import { getStoredUsers } from '../lib/db';
import { Users, Ticket, Award, Download, ShieldCheck, LogOut } from 'lucide-react';
import { auth, googleProvider, signInWithPopup } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    winners: 0,
    discountsGiven: 0
  });

  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const ADMIN_EMAIL = 'francisfabin860@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Only fetch data if they are logged in and they are the admin
    if (!adminUser || adminUser.email !== ADMIN_EMAIL) return;
    const fetchData = async () => {
      const data = await getStoredUsers();
      // data is now an array from Firestore
      const userArray = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setUsers(userArray);

      const total = userArray.length;
      const winners = userArray.filter(u => u.reward && u.reward.type !== 'none').length;
      setStats({ total, winners, discountsGiven: winners });
      setLoading(false);
    };

    fetchData();
  }, [adminUser]);

  const handleLogin = async () => {
    setAuthError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
      setAuthError('Failed to sign in. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUsers([]);
      setLoading(true);
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = () => {
    if (users.length === 0) return;
    
    const headers = ['Name', 'Age', 'Phone', 'Prize Won', 'Coupon Code', 'Date'];
    const csvContent = [
      headers.join(','),
      ...users.map(u => [
        `"${u.name || ''}"`,
        `"${u.age || ''}"`,
        `"${u.phone || ''}"`,
        `"${u.reward ? u.reward.label : 'Pending'}"`,
        `"${u.couponCode || ''}"`,
        `"${u.timestamp ? new Date(u.timestamp).toLocaleString() : ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'karate_campaign_leads.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-karate-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!adminUser || adminUser.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 relative z-10">
        <div className="glass-card w-full max-w-md p-8 text-center relative overflow-hidden">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-karate-dark border border-white/10 mb-4">
            <ShieldCheck className="text-karate-gold" size={32} />
          </div>
          <h2 className="text-3xl font-bold mb-2">Admin Access</h2>
          <p className="text-gray-400 text-sm mb-8">
            {adminUser ? "Access Denied. You are not authorized." : "Sign in with your admin account to continue."}
          </p>

          {authError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
              {authError}
            </div>
          )}

          {adminUser ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-white/20 rounded-xl shadow-sm text-base font-bold text-white bg-white/5 hover:bg-white/10 transition-all"
            >
              Sign out and try another account
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-black bg-karate-gold hover:bg-yellow-500 transition-all"
            >
              Sign in with Google
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] p-6 relative z-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold glow-text">Admin Dashboard</h2>
          <p className="text-gray-400 text-sm">Welcome back, {adminUser.displayName || 'Admin'}</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 px-6 py-2 bg-karate-gold text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors"
          >
            <Download size={20} /> Export CSV
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white font-bold rounded-lg hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-karate-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="p-4 bg-blue-500/20 rounded-full">
            <Users className="text-blue-500" size={32} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Total Leads</p>
            <p className="text-3xl font-black">{stats.total}</p>
          </div>
        </div>
        
        <div className="glass-card p-6 flex items-center gap-4 border-l-4 border-l-karate-gold">
          <div className="p-4 bg-karate-gold/20 rounded-full">
            <Ticket className="text-karate-gold" size={32} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Discounts Won</p>
            <p className="text-3xl font-black">{stats.winners}</p>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4 border-l-4 border-l-green-500">
          <div className="p-4 bg-green-500/20 rounded-full">
            <Award className="text-green-500" size={32} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Conversion Rate</p>
            <p className="text-3xl font-black">
              {stats.total > 0 ? Math.round((stats.winners / stats.total) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/50 text-gray-300">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Age</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Prize Won</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Coupon Code</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No leads collected yet.</td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-gray-300">{user.age || '-'}</td>
                    <td className="px-6 py-4 text-gray-300">{user.phone}</td>
                    <td className="px-6 py-4">
                      {user.reward ? (
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${
                          user.reward.type === 'none' ? 'bg-gray-500/20 text-gray-400' : 'bg-karate-gold/20 text-karate-gold'
                        }`}>
                          {user.reward.label}
                        </span>
                      ) : (
                        <span className="text-yellow-500">Pending Scratch</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-300">{user.couponCode || '-'}</td>
                    <td className="px-6 py-4 text-gray-400">
                      {user.timestamp ? new Date(user.timestamp).toLocaleString() : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
