import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiHeart, FiShoppingCart, FiShield, FiTruck, FiRefreshCw } from 'react-icons/fi';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    // LocalStorage ma'lumotlarini o'qish
    const savedProducts = JSON.parse(localStorage.getItem('savat_products')) || [];
    setProductsList(savedProducts);

    const foundProduct = savedProducts.find((p) => String(p.id) === String(id));
    setProduct(foundProduct);

    const savedUser = JSON.parse(localStorage.getItem('savat_user'));
    if (savedUser) setUser(savedUser);

    const savedCart = JSON.parse(localStorage.getItem('savat_cart')) || [];
    setCart(savedCart);

    const savedWishlist = JSON.parse(localStorage.getItem('savat_wishlist')) || [];
    setWishlist(savedWishlist);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-darkBg text-white flex flex-col justify-between">
        <Navbar products={productsList} />
        <div className="text-center py-20 text-gray-400">Mahsulot topilmadi!</div>
        <Footer />
      </div>
    );
  }

  const isLiked = wishlist.some((item) => item.id === product.id);

  const toggleWishlist = () => {
    let updated;
    if (isLiked) {
      updated = wishlist.filter((item) => item.id !== product.id);
    } else {
      updated = [...wishlist, product];
    }
    setWishlist(updated);
    localStorage.setItem('savat_wishlist', JSON.stringify(updated));
  };

  const addToCart = () => {
    const updated = [...cart, product];
    setCart(updated);
    localStorage.setItem('savat_cart', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-darkBg text-white flex flex-col justify-between">
      <div>
        <Navbar 
          cartCount={cart.length} 
          wishlistCount={wishlist.length} 
          user={user} 
          products={productsList}
        />

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumb nav */}
          <div className="text-xs text-gray-400 mb-6 flex items-center gap-2">
            <Link to="/" className="hover:text-white">Bosh sahifa</Link> / 
            <span className="capitalize">{product.category}</span> / 
            <span className="text-gray-200">{product.title}</span>
          </div>

          {/* Yuqori qism: Rasm va Sotib olish bloklari */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            
            {/* Chap tomondagi Rasm joyi */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full h-[400px] bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center overflow-hidden relative">
                {product.image ? (
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-500 font-medium">Mahsulot Rasmi</span>
                )}
                <button
                  onClick={toggleWishlist}
                  className="absolute top-4 right-4 p-3 rounded-full bg-slate-800/80 text-white hover:scale-110 transition-all"
                >
                  <FiHeart className={isLiked ? "fill-red-500 text-red-500" : ""} size={20} />
                </button>
              </div>
            </div>

            {/* O'rta qism: Asosiy ma'lumotlar */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-3 text-white leading-snug">{product.title}</h1>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-yellow-400 font-semibold text-sm">⭐ {product.rating || 4.8}</span>
                  <span className="text-gray-500 text-xs">(574 ta sharh)</span>
                </div>

                <div className="border-t border-b border-slate-800 py-4 my-4 space-y-2 text-sm text-gray-300">
                  <p><strong className="text-gray-400">Kategoriya:</strong> <span className="capitalize">{product.category}</span></p>
                  <p><strong className="text-gray-400">Mavjudligi:</strong> <span className="text-green-400">Omborda bor</span></p>
                </div>
              </div>

              {/* Afzalliklar bloki */}
              <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-3 text-xs text-gray-300">
                  <FiTruck className="text-neonCyan text-lg" />
                  <span><strong>Eshikkacha yetkazib berish:</strong> 1 kun ichida</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-300">
                  <FiShield className="text-neonCyan text-lg" />
                  <span><strong>Kafolat:</strong> 12 oy rasmiy kafolat</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-300">
                  <FiRefreshCw className="text-neonCyan text-lg" />
                  <span><strong>Qaytarish:</strong> 10 kun ichida bepul</span>
                </div>
              </div>
            </div>

            {/* O'ng tomondagi Xarid qilish paneli */}
            <div className="lg:col-span-3">
              <div className="bg-cardBg border border-slate-800 p-6 rounded-3xl sticky top-24 shadow-xl">
                <div className="mb-6">
                  <span className="text-xs text-gray-400 block mb-1">Narxi:</span>
                  <div className="text-3xl font-extrabold text-neonCyan">${product.price}</div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={addToCart}
                    className="w-full bg-brandBlue hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                  >
                    <FiShoppingCart /> Savatga qo'shish
                  </button>
                  <button className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold py-3 rounded-xl transition-all text-sm">
                    1-likda xarid qilish
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Pastki qism: Admin panelda kiritilgan tavsif */}
          <section className="bg-cardBg border border-slate-800 rounded-3xl p-8 mb-12">
            <h2 className="text-xl font-bold mb-6 text-neonCyan border-b border-slate-800 pb-3">
              Mahsulot tavsifi va xususiyatlari
            </h2>

            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {product.description ? (
                product.description
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-base text-white mb-2">✨ Asosiy afzalliklari:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Yuqori sifat:</strong> Uzoq muddatli va ishonchli foydalanish kafolati.</li>
                      <li><strong>Keng qo'llash doirasi:</strong> Kundalik va professional foydalanish uchun moslashtirilgan.</li>
                      <li><strong>Ergonomik dizayn:</strong> Ixcham va qulay shakl omili.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white mb-2">📋 Qo'llash usuli / Xususiyatlari:</h3>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Mahsulotni qadoqdan chiqarib ko'rsatmalarga rioya qiling.</li>
                      <li>Tizim yoki qurilmaga to'g'ri ulanganligiga ishonch hosil qiling.</li>
                      <li>Maksimal samaradorlik uchun qo'llanma bo'yicha foydalaning.</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;