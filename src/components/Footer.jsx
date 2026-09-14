import React from 'react';
import { FaTelegramPlane, FaInstagram } from 'react-icons/fa';
import { FiPhone, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-[#070a12] border-t border-slate-800 text-gray-400 pt-8 sm:pt-12 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 sm:mb-12">
        
        {/* Brand haqida */}
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-3 sm:mb-4">
            Savat<span className="text-[#06B6D4]">.uz</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mb-4 leading-relaxed">
            Eng zamonaviy texnikalar va sifatli mahsulotlar onlayn do'koni.
          </p>
          <p className="text-[11px] sm:text-xs text-slate-500">© 2026 Savat.uz. Barcha huquqlar himoyalangan.</p>
        </div>

        {/* Kategoriyalar */}
        <div>
          <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">Kategoriyalar</h4>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li><a href="#" className="hover:text-neonCyan transition-colors">Elektronika</a></li>
            <li><a href="#" className="hover:text-neonCyan transition-colors">Aksessuarlar</a></li>
            <li><a href="#" className="hover:text-neonCyan transition-colors">Aqlli uy jihozlari</a></li>
            <li><a href="#" className="hover:text-neonCyan transition-colors">Kiyim-kechak</a></li>
          </ul>
        </div>

        {/* Yordam */}
        <div>
          <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">Mijozlarga yordam</h4>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li><a href="#" className="hover:text-neonCyan transition-colors">Yetkazib berish</a></li>
            <li><a href="#" className="hover:text-neonCyan transition-colors">To'lov usullari</a></li>
            <li><a href="#" className="hover:text-neonCyan transition-colors">Qaytarish siyosati</a></li>
            <li><a href="#" className="hover:text-neonCyan transition-colors">Ko'p beriladigan savollar</a></li>
          </ul>
        </div>

        {/* Aloqa va Ijtimoiy tarmoqlar */}
        <div>
          <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">Aloqa</h4>
          <p className="text-xs sm:text-sm mb-2 text-gray-300 flex items-center gap-2">
            <FiPhone size={16} className="text-[#06B6D4]" /> +998 (94) 205-99-49
          </p>
          <p className="text-xs sm:text-sm mb-4 text-gray-300 flex items-center gap-2">
            <FiMail size={16} className="text-[#06B6D4]" /> info@savat.uz
          </p>
          
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            <a 
              href="https://t.me/+CRpf_zv8qyw2NmRi" 
              target="_blank"
              className="px-3 sm:px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-medium text-gray-300 hover:text-white hover:border-[#06B6D4] transition-colors flex items-center gap-2"
            >
              <FaTelegramPlane size={14} className="text-cyan-400" />
              Telegram
            </a>
            <a 
              href="#" 
              className="px-3 sm:px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-medium text-gray-300 hover:text-white hover:border-[#06B6D4] transition-colors flex items-center gap-2"
            >
              <FaInstagram size={14} className="text-pink-500" />
              Instagram
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;