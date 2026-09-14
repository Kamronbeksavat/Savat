import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFoundPage = () => {
  const navigate = useNavigate();

  // Cart va Wishlist sonlarini ko'rsatish uchun localStorage'dan olish
  const cart = JSON.parse(localStorage.getItem('savat_cart')) || [];
  const wishlist = JSON.parse(localStorage.getItem('savat_wishlist')) || [];
  const user = JSON.parse(localStorage.getItem('savat_user')) || null;

  return (
    <div className="min-h-screen bg-darkBg text-white flex flex-col justify-between selection:bg-[#06B6D4] selection:text-black">
      <div>
        <Navbar 
          cartCount={cart.length} 
          wishlistCount={wishlist.length} 
          user={user}
        />

        <main className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center justify-center text-center">
          {/* Glitch / Glow Effektli 404 matni */}
          <div className="relative mb-6">
            <h1 className="text-8xl sm:text-9xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] via-blue-500 to-purple-600 animate-pulse">
              404
            </h1>
            <div className="absolute inset-0 bg-[#06B6D4]/10 blur-3xl rounded-full -z-10" />
          </div>

          {/* Sarlavha va Tavsif */}
          <h2 className="text-2xl sm:text-4xl font-bold mb-4 tracking-tight">
            Voy! Bu sahifa topilmadi
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-md mb-8">
            Siz qidirayotgan sahifa o‘chirilgan, nomi o‘zgartirilgan yoki vaqtincha mavjud bo‘lmasligi mumkin.
          </p>

          {/* Boshqaruv Tugmalari */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl border border-slate-700 bg-cardBg hover:bg-slate-800 text-gray-300 font-semibold text-sm transition-all duration-200"
            >
              ⬅️ Orqaga qaytish
            </button>
            <Link
              to="/"
              className="px-6 py-3 rounded-xl bg-[#06B6D4] hover:bg-[#049cbc] text-white font-bold text-sm shadow-lg shadow-[#06B6D4]/30 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>🏠 Bosh sahifaga o'tish</span>
            </Link>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default NotFoundPage;