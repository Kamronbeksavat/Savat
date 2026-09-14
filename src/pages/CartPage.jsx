import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiMapPin, FiPhone, FiX } from 'react-icons/fi';

const regions = [
  "Toshkent shahri",
  "Toshkent viloyati",
  "Andijon viloyati",
  "Buxoro viloyati",
  "Farg'ona viloyati",
  "Jizzax viloyati",
  "Xorazm viloyati",
  "Namangan viloyati",
  "Navoiy viloyati",
  "Qashqadaryo viloyati",
  "Qoraqalpog'iston Respublikasi",
  "Samarqand viloyati",
  "Sirdaryo viloyati",
  "Surxondaryo viloyati"
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const navigate = useNavigate();

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('savat_cart')) || [];
    setCartItems(savedCart);

    const savedUser = JSON.parse(localStorage.getItem('savat_user'));
    if (savedUser) {
      setUser(savedUser);
      if (savedUser.phone) setPhone(savedUser.phone);
    }

    const savedProducts = JSON.parse(localStorage.getItem('savat_products')) || [];
    setProductsList(savedProducts);
  }, []);

  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem('savat_cart', JSON.stringify(newCart));
  };

  const increaseQuantity = (id) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        return { ...item, count: (item.count || 1) + 1 };
      }
      return item;
    });
    updateCart(updated);
  };

  const decreaseQuantity = (id) => {
    const updated = cartItems
      .map((item) => {
        if (item.id === id) {
          const newCount = (item.count || 1) - 1;
          return newCount > 0 ? { ...item, count: newCount } : null;
        }
        return item;
      })
      .filter(Boolean);
    updateCart(updated);
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    updateCart(updated);
  };

  const totalPrice = cartItems.reduce((acc, item) => {
    const count = item.count || 1;
    return acc + item.price * count;
  }, 0);

  const totalItemsCount = cartItems.reduce((acc, item) => acc + (item.count || 1), 0);

  const handleOpenModal = () => {
    if (!user) {
      alert("Buyurtma berish uchun avval tizimga kiring!");
      return;
    }
    setShowOrderModal(true);
  };

  const handleCreateOrder = (e) => {
    e.preventDefault();

    if (!selectedRegion) {
      alert("Iltimos, viloyatni tanlang!");
      return;
    }

    if (!streetAddress.trim() || !phone.trim()) {
      alert("Iltimos, manzil va telefon raqamingizni kiriting!");
      return;
    }

    const existingOrders = JSON.parse(localStorage.getItem('savat_orders')) || [];
    const fullAddress = `${selectedRegion}, ${streetAddress}`;

    const newOrder = {
      id: Date.now(),
      userId: user.id || Date.now(),
      userName: user.name || "Noma'lum Foydalanuvchi",
      userEmail: user.email || "",
      address: fullAddress,
      phone: phone,
      items: cartItems,
      totalPrice: totalPrice,
      status: 'pending',
      message: "Ko'rib chiqilmoqda...",
      createdAt: new Date().toLocaleString()
    };

    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem('savat_orders', JSON.stringify(updatedOrders));

    updateCart([]);
    setShowOrderModal(false);

    alert("Buyurtmangiz muvaffaqiyatli yuborildi!");
    navigate(`/profile/${user.id || 'me'}`);
  };

  return (
    <div className="min-h-screen bg-darkBg text-white flex flex-col justify-between">
      <div>
        <Navbar 
          cartCount={totalItemsCount} 
          user={user} 
          products={productsList} 
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <h1 className="text-xl sm:text-3xl font-extrabold mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
            <FiShoppingBag className="text-neonCyan flex-shrink-0" /> Sizning Savatingiz
          </h1>

          {cartItems.length === 0 ? (
            <div className="bg-cardBg border border-slate-800 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center my-6 sm:my-8">
              <p className="text-gray-400 mb-6 text-base sm:text-lg">Savatingiz hozircha bo'sh</p>
              <Link
                to="/"
                className="bg-brandBlue hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 inline-block text-sm"
              >
                Xarid qilishni boshlash
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              {/* SAVATDAGI MAHSULOTLAR RO'YXATI */}
              <div className="lg:col-span-8 space-y-3 sm:space-y-4">
                {cartItems.map((item, index) => {
                  const count = item.count || 1;
                  return (
                    <div
                      key={`${item.id}-${index}`}
                      className="bg-cardBg border border-slate-800 rounded-2xl p-3 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 transition-all hover:border-slate-700"
                    >
                      {/* Mahsulot ma'lumotlari */}
                      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs text-gray-500">Rasm</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link to={`/product/${item.id}`} className="font-bold text-sm sm:text-base text-white hover:text-neonCyan transition-colors truncate block">
                            {item.title}
                          </Link>
                          <span className="text-xs text-gray-400 capitalize block mt-0.5">Kategoriya: {item.category}</span>
                          <div className="flex items-center gap-2 mt-1 sm:hidden">
                            <span className="text-xs text-gray-400">Dona: ${item.price}</span>
                            <span className="text-xs font-bold text-neonCyan">• Jami: ${item.price * count}</span>
                          </div>
                        </div>
                      </div>

                      {/* Miqdor va O'chirish boshqaruvi */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 border-t sm:border-t-0 border-slate-800/80 pt-3 sm:pt-0">
                        <div className="flex items-center gap-2 sm:gap-3 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 sm:px-3 sm:py-1.5">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="text-gray-400 hover:text-white p-1 transition-colors"
                            aria-label="Kamaytirish"
                          >
                            <FiMinus size={12} />
                          </button>
                          <span className="text-xs sm:text-sm font-bold w-5 text-center">{count}</span>
                          <button
                            onClick={() => increaseQuantity(item.id)}
                            className="text-gray-400 hover:text-white p-1 transition-colors"
                            aria-label="O'shirish"
                          >
                            <FiPlus size={12} />
                          </button>
                        </div>

                        <div className="text-right hidden sm:block min-w-[70px]">
                          <span className="text-[10px] text-gray-500 block uppercase tracking-wider">Jami</span>
                          <span className="text-sm sm:text-base font-extrabold text-neonCyan">${item.price * count}</span>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                          title="Savatdan o'chirish"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* BUYURTMA XULOSASI (SIDEBAR) */}
              <div className="lg:col-span-4">
                <div className="bg-cardBg border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:sticky lg:top-24 shadow-2xl">
                  <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 border-b border-slate-800 pb-3">Buyurtma xulosasi</h2>
                  
                  <div className="space-y-3 text-xs sm:text-sm text-gray-300 mb-6">
                    <div className="flex justify-between">
                      <span>Mahsulotlar soni:</span>
                      <span className="font-semibold text-white">{totalItemsCount} ta</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Yetkazib berish:</span>
                      <span className="text-green-400 font-semibold">Bepul</span>
                    </div>
                    <div className="border-t border-slate-800 pt-3 flex justify-between text-sm sm:text-base font-bold text-white">
                      <span>Jami summa:</span>
                      <span className="text-neonCyan text-lg sm:text-xl">${totalPrice}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleOpenModal}
                    className="w-full bg-brandBlue hover:bg-blue-600 text-white font-bold py-3 sm:py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 text-sm"
                  >
                    Buyurtma berish
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL OYNA */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-cardBg border border-slate-800 w-full max-w-md rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl relative my-auto">
            <button
              onClick={() => setShowOrderModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <FiX size={20} />
            </button>

            <h3 className="text-base sm:text-lg font-bold mb-4 text-white flex items-center gap-2 pr-6">
              <FiShoppingBag className="text-neonCyan flex-shrink-0" /> Buyurtmani Rasmiylashtirish
            </h3>
            
            <form onSubmit={handleCreateOrder} className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Viloyatni tanlang</label>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm">
                  <FiMapPin className="text-gray-400 flex-shrink-0" />
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="bg-transparent text-white w-full focus:outline-none cursor-pointer text-xs sm:text-sm"
                    required
                  >
                    <option value="" className="bg-slate-900 text-gray-400">Viloyatni tanlang...</option>
                    {regions.map((reg, idx) => (
                      <option key={idx} value={reg} className="bg-slate-900 text-white">
                        {reg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Tuman, ko'cha va xonadon</label>
                <input
                  type="text"
                  placeholder="Masalan: Chilonzor tumani, 5-mavze, 12-uy"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-brandBlue"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Telefon raqamingiz</label>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm">
                  <FiPhone className="text-gray-400 flex-shrink-0" />
                  <input
                    type="tel"
                    placeholder="+998 90 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-transparent text-white w-full focus:outline-none text-xs sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 text-xs text-gray-400 flex justify-between items-center">
                <span>To'lov summasi:</span>
                <b className="text-neonCyan text-sm">${totalPrice}</b>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 text-xs text-gray-400 hover:text-white"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="bg-brandBlue hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/20"
                >
                  Tasdiqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CartPage;