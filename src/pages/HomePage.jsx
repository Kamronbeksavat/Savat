import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';

// Swiper komponentlari va stillari
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Standart 2 ta banner rasmi
const defaultBanners = [
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80'
];

// Zaxira (default) kategoriyalar - agar localStorage bo'sh bo'lsa
const defaultCategories = [
  { id: 'all', name: 'Barchasi', icon: '🔥', slug: 'all' },
  { id: 'phones', name: 'Smartfonlar', icon: '📱', slug: 'phones' },
  { id: 'laptops', name: 'Noutbuklar', icon: '💻', slug: 'laptops' },
  { id: 'audio', name: 'Quloqchinlar', icon: '🎧', slug: 'audio' },
  { id: 'watch', name: 'Aqlli soatlar', icon: '⌚', slug: 'watch' }
];

const defaultProducts = [
  { id: 1, title: 'Smartfon Savat Pro 15', category: 'phones', price: 899, image: '', rating: 4.8 },
  { id: 2, title: 'Simsiz Quloqchin Neon Sound', category: 'audio', price: 79, image: '', rating: 4.5 },
  { id: 3, title: 'Ultrabook Savat X', category: 'laptops', price: 1200, image: '', rating: 4.9 },
  { id: 4, title: 'Smart Watch Sport v2', category: 'watch', price: 150, image: '', rating: 4.6 }
];

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Admin paneldan kiritilgan kategoriyalarni yuklab olish
  const [categories] = useState(() => {
    const savedCategories = JSON.parse(localStorage.getItem('savat_categories'));
    
    if (savedCategories && savedCategories.length > 0) {
      // Birinchi o'ringa har doim "Barchasi" kategoriyasini qo'shamiz
      return [{ id: 'all', name: 'Barchasi', icon: '🔥', slug: 'all' }, ...savedCategories];
    }
    
    return defaultCategories;
  });

  // Bannerlar ro'yxati
  const [banners] = useState(() => {
    const savedBanners = JSON.parse(localStorage.getItem('savat_banners'));
    if (savedBanners && savedBanners.length > 0) {
      return [...defaultBanners, ...savedBanners];
    }
    return defaultBanners;
  });

  // Mahsulotlar ro'yxati
  const [products] = useState(() => {
    const savedProducts = localStorage.getItem('savat_products');
    if (savedProducts) return JSON.parse(savedProducts);
    localStorage.setItem('savat_products', JSON.stringify(defaultProducts));
    return defaultProducts;
  });

  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('savat_cart')) || []);
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('savat_wishlist')) || []);

  useEffect(() => {
    const savedUser = localStorage.getItem('savat_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('savat_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('savat_user');
  };

  const toggleWishlist = (product) => {
    const isLiked = wishlist.some(item => item.id === product.id);
    const updated = isLiked ? wishlist.filter(i => i.id !== product.id) : [...wishlist, product];
    setWishlist(updated);
    localStorage.setItem('savat_wishlist', JSON.stringify(updated));
  };

  const addToCart = (product) => {
    const updated = [...cart, product];
    setCart(updated);
    localStorage.setItem('savat_cart', JSON.stringify(updated));
  };

  // Kategoriya boyicha mahsulotlarni filtrlash (slug hamda id ni hisobga oladi)
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-darkBg text-white flex flex-col justify-between overflow-x-hidden">
      <div>
        <Navbar 
          cartCount={cart.length} 
          wishlistCount={wishlist.length} 
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={handleLogout}
          products={products}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Main Hero Banner with Swiper Slider */}
          <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-900/60 to-slate-900 border border-slate-800 p-4 sm:p-8 lg:p-10 mb-8 sm:mb-12 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center overflow-hidden">
            
            {/* Chap tomondagi Matn bloki */}
            <div className="lg:col-span-6 z-10 text-center sm:text-left">
              <span className="text-[10px] sm:text-xs font-bold bg-[#06B6D4]/20 text-neonCyan px-2.5 py-1 rounded-full uppercase tracking-wider mb-3 sm:mb-4 inline-block">
                Katta chegirma
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-2 sm:mb-4 leading-snug sm:leading-tight">
                Texnologiyalarni <br className="hidden sm:inline" />
                <span className="text-neonCyan">Savat.uz</span> bilan kashf eting
              </h1>
              <p className="text-gray-300 text-xs sm:text-base mb-5 sm:mb-6 max-w-lg mx-auto sm:mx-0">
                Barcha turdagi gadjetlar va maishiy texnika mahsulotlariga 30% gacha maxsus chegirmalar!
              </p>
              <button className="w-full sm:w-auto bg-[#049cbc] hover:bg-[#06B6D4] text-white text-sm sm:text-base font-bold px-6 py-2.5 sm:py-3 rounded-xl shadow-lg shadow-[#06B6D4]/30 transition-all">
                Hozir xarid qilish
              </button>
            </div>

            {/* O'ng tomondagi Swiper Slayder bloki */}
            <div className="lg:col-span-6 w-full h-[180px] sm:h-[280px] lg:h-[320px] rounded-xl sm:rounded-2xl overflow-hidden border border-slate-700/60 shadow-xl">
              <Swiper
                spaceBetween={0}
                centeredSlides={true}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                modules={[Autoplay, Pagination, Navigation]}
                className="w-full h-full"
              >
                {banners.map((imgUrl, index) => (
                  <SwiperSlide key={index} className="w-full h-full relative">
                    <img 
                      src={imgUrl} 
                      alt={`Banner ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

          </div>

          {/* Dinamik Kategoriyalar (Admin paneldan olingan) */}
          <section className="mb-8 sm:mb-10">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Kategoriyalar</h2>
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none touch-pan-x">
              {categories.map((cat) => {
                const catValue = cat.slug || cat.id;

                return (
                  <button
                    key={cat.id || cat.slug}
                    onClick={() => setSelectedCategory(catValue)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all whitespace-nowrap flex-shrink-0 ${
                      selectedCategory === catValue
                        ? 'bg-[#06B6D4] text-white shadow-lg shadow-[#06B6D4]/20'
                        : 'bg-cardBg border border-slate-800 text-gray-400 hover:text-white hover:border-[#06B6D4] hover:bg-[#06B6D4]'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Mahsulotlar Ro'yxati */}
          <section className="mb-8 sm:mb-12">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-2xl font-bold tracking-tight">
                Saralangan <span className="text-neonCyan">Mahsulotlar</span>
              </h2>
              <span className="text-xs sm:text-sm text-gray-400">{filteredProducts.length} ta mahsulot</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((product) => {
                const isLiked = wishlist.some(w => w.id === product.id);

                return (
                  <div
                    key={product.id}
                    className="bg-cardBg border border-slate-800 hover:border-brandBlue/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group relative"
                  >
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-1.5 sm:p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-[10px] sm:text-xs transition-colors"
                    >
                      {isLiked ? '❤️' : '🤍'}
                    </button>

                    <Link to={`/product/${product.id}`}>
                      <div className="w-full h-32 sm:h-48 bg-slate-900 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-600 text-xs sm:text-sm mb-3 sm:mb-4 overflow-hidden">
                        {product.image ? <img src={product.image} alt={product.title} className="w-full h-full object-cover" /> : 'Rasm o\'rni'}
                      </div>

                      <div className="flex items-center gap-1 text-[10px] sm:text-xs text-yellow-400 mb-1">
                        ⭐ <span>{product.rating || 5.0}</span>
                      </div>

                      <h3 className="font-bold text-xs sm:text-base text-white mb-2 line-clamp-1 group-hover:text-neonCyan transition-colors">
                        {product.title}
                      </h3>
                    </Link>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 sm:pt-4 border-t border-slate-800/80">
                      <div>
                        <span className="text-[10px] sm:text-xs text-gray-500 block">Narx</span>
                        <span className="text-sm sm:text-lg font-extrabold text-neonCyan">${product.price}</span>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full sm:w-auto bg-slate-900 border border-[#06B6D4] hover:bg-[#06B6D4] text-white text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors text-center"
                      >
                        + Savatga
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>

      <Footer />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default HomePage;