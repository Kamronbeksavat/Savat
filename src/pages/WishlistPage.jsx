import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiLogOut, FiSearch, FiX, FiHeart, FiSettings } from 'react-icons/fi';

const Navbar = ({ cartCount = 0, wishlistCount = 0, user, onOpenAuth, onLogout, products = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Admin foydalanuvchisini aniqlash
  const isAdmin = user?.role === 'admin' || user?.email === 'admin@gmail.com';

  // Har bir kiritilgan harf bo'yicha mahsulotlarni filtrlaymiz
  const searchResults = searchQuery.trim() === ''
    ? []
    : products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <header className="bg-[#0d1322] border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3">
        
        {/* Asosiy qator: Logo va Barcha harakatlar (Wishlist, Cart, Admin, Profile, Auth) */}
        <div className="flex items-center justify-between gap-2">
          
          {/* Logo */}
          <Link to="/" className="text-lg sm:text-2xl font-extrabold tracking-tight flex items-center gap-1 flex-shrink-0">
            <span>Savat</span>
            <span className="text-[#06B6D4]">.uz</span>
          </Link>

          {/* O'ng tarafdagi tugmalar bloki (Mobil va Desktop uchun umumiy) */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Wishlist */}
            <Link 
              to="/wishlist" 
              className="relative p-2 text-gray-300 hover:text-neonCyan transition-colors"
              title="Sevimlilar"
            >
              <FiHeart size={18} className="sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart / Savat */}
            <Link
              to="/cart"
              className="relative flex items-center gap-1 bg-slate-900 border border-slate-700 hover:border-[#06B6D4] text-white px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all"
              title="Savat"
            >
              <span className="text-sm sm:text-lg">🛒</span>
              <span className="hidden sm:inline text-sm font-medium">Savat</span>
              {cartCount > 0 && (
                <span className="bg-[#06B6D4] text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.2 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Admin Dashboard Tugmasi */}
                {isAdmin && (
                  <Link
                    to="/savata"
                    className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-md transition-all text-xs font-bold"
                    title="Admin Dashboard"
                  >
                    <FiSettings size={16} />
                    <span className="hidden md:inline">Dashboard</span>
                  </Link>
                )}

                {/* Profil Sahifasi */}
                <Link
                  to={`/profile/${user.id || 'me'}`}
                  className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 bg-slate-900 border border-slate-700 hover:border-[#06B6D4] text-[#06B6D4] rounded-xl transition-all"
                  title="Profil"
                >
                  <FiUser size={16} className="sm:w-5 sm:h-5" />
                  <span className="hidden md:inline text-sm font-medium text-white">{user.name}</span>
                </Link>

                {/* Chiqish Tugmasi */}
                <button
                  onClick={onLogout}
                  title="Chiqish"
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <FiLogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="text-xs sm:text-sm font-medium bg-[#06B6D4] hover:bg-[#06B6D4]/80 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-xl transition-all"
              >
                Kirish
              </button>
            )}
          </div>
        </div>

        {/* Qidiruv qatori (Har doim pastki qatorda yoki moslashuvchan turadi) */}
        <div className="mt-3 relative w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="Mahsulotlarni qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 text-xs sm:text-sm rounded-xl px-4 py-2 pl-9 pr-9 text-white placeholder-gray-400 focus:outline-none focus:border-[#06B6D4] transition-all"
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={16} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
              >
                <FiX size={16} />
              </button>
            )}
          </div>

          {/* Qidiruv natijalari menyusi */}
          {searchQuery.trim() !== '' && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d1322] border border-slate-800 rounded-2xl shadow-2xl max-h-80 overflow-y-auto z-50 p-2">
              {searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSearchQuery('')}
                    className="flex items-center gap-3 p-2.5 hover:bg-slate-900 rounded-xl transition-colors cursor-pointer border-b border-slate-800/40 last:border-none"
                  >
                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-xs text-gray-500 overflow-hidden flex-shrink-0">
                      {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" /> : 'Rasm'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-white truncate">{item.title}</h4>
                      <span className="text-[10px] text-gray-400 uppercase">{item.category}</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-neonCyan">${item.price}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs sm:text-sm text-gray-400">
                  Afsuski, "{searchQuery}" bo'yicha hech narsa topilmadi.
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;