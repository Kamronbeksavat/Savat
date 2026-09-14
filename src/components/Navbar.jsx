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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
        
        {/* Yuqori qator: Logo va harakatlar tugmasi (Mobil vaqtida yonma-yon) */}
        <div className="flex items-center justify-between w-full md:w-auto gap-2 sm:gap-4">
          <Link to="/" className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-1">
            <span>Savat</span>
            <span className="text-[#06B6D4]">.uz</span>
          </Link>

          {/* Mobil qurilmalar uchun harakatlar bloki (Wishlist, Cart, Dashboard/Admin, Profile, Auth) */}
          <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
            <Link 
              to="/wishlist" 
              className="relative p-2 text-gray-300 hover:text-neonCyan transition-colors"
              title="Sevimlilar"
            >
              <FiHeart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative flex items-center gap-1 bg-slate-900 border border-slate-700 text-white px-2.5 py-1.5 rounded-xl transition-all"
              title="Savat"
            >
              <span className="text-sm">🛒</span>
              {cartCount > 0 && (
                <span className="bg-[#06B6D4] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-1">
                {/* MOBIL: Agar admin bo'lsa Dashboard ikonchasi */}
                {isAdmin && (
                  <Link
                    to="/savata"
                    className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-md transition-all"
                    title="Admin Dashboard"
                  >
                    <FiSettings size={18} />
                  </Link>
                )}

                {/* MOBIL: Profil sahifasiga o'tish ikonchasi */}
                <Link
                  to={`/profile/${user.id || 'me'}`}
                  className="p-2 bg-slate-900 border border-slate-700 text-[#06B6D4] rounded-xl transition-all"
                  title="Profil"
                >
                  <FiUser size={18} />
                </Link>

                {/* MOBIL: Chiqish tugmasi */}
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
                className="text-xs font-medium bg-[#06B6D4] text-white px-3 py-2 rounded-xl transition-all"
              >
                Kirish
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Search Bar */}
        <div className="w-full md:flex-1 md:max-w-2xl relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Mahsulotlarni qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 text-xs sm:text-sm rounded-xl px-4 py-2 sm:py-2.5 pl-9 sm:pl-10 pr-9 text-white placeholder-gray-400 focus:outline-none focus:border-[#06B6D4] transition-all"
            />
            <FiSearch className="absolute left-3 top-2.5 sm:top-3 text-gray-400" size={16} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 sm:top-3 text-gray-400 hover:text-white"
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
                    className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 hover:bg-slate-900 rounded-xl transition-colors cursor-pointer border-b border-slate-800/40 last:border-none"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-800 rounded-lg flex items-center justify-center text-xs text-gray-500 overflow-hidden flex-shrink-0">
                      {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" /> : 'Rasm'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-white truncate">{item.title}</h4>
                      <span className="text-[10px] sm:text-xs text-gray-400 uppercase">{item.category}</span>
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

        {/* User Nav (Ishchi stoli (Desktop) ko'rinishi) */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            to="/wishlist" 
            className="relative p-2 text-gray-300 hover:text-neonCyan transition-colors cursor-pointer"
          >
            <FiHeart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="relative flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-[#06B6D4] hover:bg-[#06B6D4] text-white px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            <span className="text-lg">🛒</span>
            <span className="text-sm font-medium">Savat</span>
            {cartCount > 0 && (
              <span className="bg-[#06B6D4] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
            {user ? (
              <div className="flex items-center gap-2">
                {/* DESKTOP: FAQAT ADMIN UCHUN: Dashboard Tugmasi */}
                {isAdmin && (
                  <Link
                    to="/savata"
                    className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold px-3 py-2 rounded-xl border border-purple-400/30 shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
                  >
                    <FiSettings size={14} />
                    <span>Dashboard</span>
                  </Link>
                )}

                {/* DESKTOP: Foydalanuvchi profili linki */}
                <Link
                  to={`/profile/${user.id || 'me'}`}
                  className="flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-[#06B6D4] px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  <FiUser className="text-[#06B6D4]" />
                  <span className="text-sm font-medium text-white">{user.name}</span>
                </Link>

                {/* DESKTOP: Tizimdan chiqish tugmasi */}
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
                className="text-sm font-medium bg-[#06B6D4] hover:bg-[#06B6D4]/80 text-white px-4 py-2 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
              >
                Kirish / Ro'yxatdan o'tish
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;