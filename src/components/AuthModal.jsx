import React, { useState } from 'react';

// Admin login va paroli
const ADMIN_EMAIL = 'savata@gmail.com';
const ADMIN_PASSWORD = 'savat123';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Admin tekshiruvi
    const isAdmin = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD;

    if (isLogin) {
      // Tizimga kirish
      const userData = {
        name: isAdmin ? 'Admin' : (name || email.split('@')[0]),
        email: email,
        role: isAdmin ? 'admin' : 'user'
      };

      onLoginSuccess(userData);
      onClose();
    } else {
      // Ro'yxatdan o'tish
      const userData = {
        name: name || 'Foydalanuvchi',
        email: email,
        role: isAdmin ? 'admin' : 'user'
      };

      onLoginSuccess(userData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-cardBg border border-slate-800 w-full max-w-md rounded-2xl p-5 sm:p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-3.5 right-4 text-gray-400 hover:text-white text-lg sm:text-xl font-bold p-1"
        >
          ✕
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">
          {isLogin ? 'Tizimga kirish' : 'Ro‘yxatdan o‘tish'}
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 text-xs p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 sm:gap-4">
          {!isLogin && (
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Ismingiz</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ismingizni kiriting"
                className="w-full bg-slate-900 border border-slate-700 focus:border-[#06B6D4] text-white px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm outline-none transition-all"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full bg-slate-900 border border-slate-700 focus:border-[#06B6D4] text-white px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Parol</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-700 focus:border-[#06B6D4] text-white px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#06B6D4] hover:bg-[#049cbc] text-white font-bold py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-[#06B6D4]/20 mt-1 sm:mt-2"
          >
            {isLogin ? 'Kirish' : 'YARATISH'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-gray-400 hover:text-[#06B6D4] transition-colors"
          >
            {isLogin ? "Hali hisobingiz yo'qmi? Ro'yxatdan o'ting" : "Hisobingiz bormi? Tizimga kiring"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;