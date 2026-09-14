import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import AdminNavbar from '../components/AdminNavbar';
import { 
  FiPlus, FiTrash2, FiEdit2, FiCheckCircle, FiUsers, 
  FiShoppingBag, FiImage, FiFolderPlus, FiLock, 
  FiBarChart2, FiTrendingUp, FiDollarSign, FiPackage, FiUserCheck 
} from 'react-icons/fi';

const AdminPage = () => {
  // Superuser Login Holati
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Admin Dashboard Holati
  const [activeTab, setActiveTab] = useState('analytics');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [banners, setBanners] = useState([]);
  const [users, setUsers] = useState([]);

  const [showProductModal, setShowProductModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [newProduct, setNewProduct] = useState({ 
    image: '', 
    rating: '5.0', 
    title: '', 
    price: '', 
    category: '', 
    description: '' 
  });
  const [newBannerImage, setNewBannerImage] = useState('');

  useEffect(() => {
    const adminAuth = sessionStorage.getItem('savat_admin_auth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }

    setCategories(JSON.parse(localStorage.getItem('savat_categories')) || []);
    setProducts(JSON.parse(localStorage.getItem('savat_products')) || []);
    setOrders(JSON.parse(localStorage.getItem('savat_orders')) || []);
    setBanners(JSON.parse(localStorage.getItem('savat_banners')) || []);
    setUsers(JSON.parse(localStorage.getItem('savat_registered_users')) || []);
  }, []);

  // Superuser Autentifikatsiyasi
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginInput === 'admin' && passwordInput === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('savat_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError("Noto'g'ri login yoki parol!");
    }
  };

  const handleLogoutAdmin = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('savat_admin_auth');
  };

  // Foydalanuvchini o'chirish funksiyasi
  const handleDeleteUser = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('savat_registered_users', JSON.stringify(updatedUsers));
  };

  // Kategoriya Funksiyalari
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const slug = newCategoryName.toLowerCase().replace(/\s+/g, '-');
    const newCat = { id: Date.now().toString(), name: newCategoryName.trim(), slug: slug };
    const updated = [...categories, newCat];
    setCategories(updated);
    localStorage.setItem('savat_categories', JSON.stringify(updated));
    setNewCategoryName('');
  };

  const handleDeleteCategory = (id) => {
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    localStorage.setItem('savat_categories', JSON.stringify(updated));
  };

  // Rasm yuklash
  const handleImageUpload = (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Mahsulot Qo'shish va Tahrirlash
  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setNewProduct({
        image: product.image || '',
        rating: product.rating || '5.0',
        title: product.title || '',
        price: product.price || '',
        category: product.category || '',
        description: product.description || ''
      });
    } else {
      setEditingProduct(null);
      setNewProduct({ image: '', rating: '5.0', title: '', price: '', category: '', description: '' });
    }
    setShowProductModal(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price || !newProduct.image) return;

    let updated;
    if (editingProduct) {
      updated = products.map((p) =>
        p.id === editingProduct.id
          ? { ...p, ...newProduct, price: Number(newProduct.price) }
          : p
      );
    } else {
      const createdProduct = { id: Date.now(), ...newProduct, price: Number(newProduct.price) };
      updated = [...products, createdProduct];
    }

    setProducts(updated);
    localStorage.setItem('savat_products', JSON.stringify(updated));
    setNewProduct({ image: '', rating: '5.0', title: '', price: '', category: '', description: '' });
    setEditingProduct(null);
    setShowProductModal(false);
  };

  const handleDeleteProduct = (id) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem('savat_products', JSON.stringify(updated));
  };

  // Buyurtmalarni tasdiqlash
  const handleApproveOrder = (orderId) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return { ...order, status: 'approved', message: "Sizning buyurtmangiz tasdiqlandi" };
      }
      return order;
    });
    setOrders(updatedOrders);
    localStorage.setItem('savat_orders', JSON.stringify(updatedOrders));
  };

  // Banner Funksiyalari
  const handleAddBanner = (e) => {
    e.preventDefault();
    if (!newBannerImage) return;
    const updated = [...banners, newBannerImage];
    setBanners(updated);
    localStorage.setItem('savat_banners', JSON.stringify(updated));
    setNewBannerImage('');
    setShowBannerModal(false);
  };

  const handleDeleteBanner = (index) => {
    const updated = banners.filter((_, i) => i !== index);
    setBanners(updated);
    localStorage.setItem('savat_banners', JSON.stringify(updated));
  };

  // Statistika hisoblash
  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0);
  const approvedOrdersCount = orders.filter(o => o.status === 'approved').length;
  const pendingOrdersCount = orders.length - approvedOrdersCount;
  const averageOrderValue = orders.length > 0 ? (totalRevenue / orders.length).toFixed(1) : 0;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-md shadow-2xl">
          <div className="w-12 h-12 bg-cyan-500/20 text-[#06B6D4] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
            <FiLock />
          </div>
          <h1 className="text-2xl font-bold text-center mb-6">Admin Kirish</h1>

          {authError && <p className="text-red-400 text-xs text-center mb-4">{authError}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Login</label>
              <input
                type="text"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#06B6D4]"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Parol</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#06B6D4]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#06B6D4] hover:bg-cyan-400 text-black font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-cyan-900/20"
            >
              Panelga Kirish
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      <div>
        <AdminNavbar cartCount={0} user={{ name: 'adminuser' }} />

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
            <h1 className="text-3xl font-extrabold text-[#06B6D4]">Admin Panel</h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-5 py-2.5 rounded-2xl">
                <FiUsers className="text-[#06B6D4] text-xl" />
                <div>
                  <span className="text-xs text-gray-400 block">Foydalanuvchilar:</span>
                  <span className="text-sm font-bold text-white">{users.length} ta</span>
                </div>
              </div>

              <button
                onClick={handleLogoutAdmin}
                className="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all"
              >
                Chiqish
              </button>
            </div>
          </div>

          {/* Tablar */}
          <div className="flex flex-wrap gap-4 mb-8 border-b border-slate-800 pb-4">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'analytics' ? 'bg-[#06B6D4] text-black font-bold' : 'bg-slate-900 text-gray-400 hover:text-white'
              }`}
            >
              <FiBarChart2 /> Statistika
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'users' ? 'bg-[#06B6D4] text-black font-bold' : 'bg-slate-900 text-gray-400 hover:text-white'
              }`}
            >
              <FiUsers /> Foydalanuvchilar ({users.length})
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'categories' ? 'bg-[#06B6D4] text-black font-bold' : 'bg-slate-900 text-gray-400 hover:text-white'
              }`}
            >
              <FiFolderPlus /> Kategoriyalar & Mahsulotlar
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'orders' ? 'bg-[#06B6D4] text-black font-bold' : 'bg-slate-900 text-gray-400 hover:text-white'
              }`}
            >
              <FiShoppingBag /> Buyurtmalar ({orders.length})
            </button>

            <button
              onClick={() => setActiveTab('banners')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'banners' ? 'bg-[#06B6D4] text-black font-bold' : 'bg-slate-900 text-gray-400 hover:text-white'
              }`}
            >
              <FiImage /> Swiper ({banners.length})
            </button>
          </div>

          {/* STATISTIKA TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center text-2xl">
                    <FiDollarSign />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">Jami Daromad</span>
                    <span className="text-xl font-bold text-white">${totalRevenue}</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-500/10 text-[#06B6D4] rounded-2xl flex items-center justify-center text-2xl">
                    <FiShoppingBag />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">Jami Buyurtmalar</span>
                    <span className="text-xl font-bold text-white">{orders.length} ta</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center text-2xl">
                    <FiPackage />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">Mavjud Mahsulotlar</span>
                    <span className="text-xl font-bold text-white">{products.length} ta</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center text-2xl">
                    <FiTrendingUp />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">O'rtacha Chek</span>
                    <span className="text-xl font-bold text-white">${averageOrderValue}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                  <h3 className="text-lg font-bold mb-6">Buyurtmalar Holati</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Tasdiqlangan</span>
                        <span className="text-emerald-400 font-bold">{approvedOrdersCount} ta</span>
                      </div>
                      <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className="bg-emerald-500 h-full transition-all duration-500" 
                          style={{ width: `${orders.length ? (approvedOrdersCount / orders.length) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Kutilmoqda</span>
                        <span className="text-amber-400 font-bold">{pendingOrdersCount} ta</span>
                      </div>
                      <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className="bg-amber-500 h-full transition-all duration-500" 
                          style={{ width: `${orders.length ? (pendingOrdersCount / orders.length) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                  <h3 className="text-lg font-bold mb-4">Tizim Ma'lumotlari</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-gray-400">Kategoriyalar soni:</span>
                      <span className="font-bold text-white">{categories.length} ta</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-gray-400">Faol Bannerlar (Swiper):</span>
                      <span className="font-bold text-white">{banners.length} ta</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-gray-400">Ro'yxatdan o'tgan mijozlar:</span>
                      <span className="font-bold text-white">{users.length} ta</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FOYDALANUVCHILAR TABI */}
          {activeTab === 'users' && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
              <h2 className="text-lg font-bold mb-6">Ro'yxatdan O'tgan Foydalanuvchilar ({users.length})</h2>
              
              <div className="grid grid-cols-1 gap-4">
                {users.map((u) => (
                  <div key={u.id || u.email} className="flex items-center justify-between bg-slate-950 border border-slate-800 p-4 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#06B6D4]/10 text-[#06B6D4] rounded-xl flex items-center justify-center font-bold text-lg">
                        <FiUserCheck size={22} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white">{u.name || "Ism ko'rsatilmagan"}</h3>
                        <p className="text-xs text-gray-400">{u.email}</p>
                        {u.role && (
                          <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                            u.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-slate-800 text-gray-400'
                          }`}>
                            {u.role}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-sm transition-all"
                      title="Foydalanuvchini o'chirish"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}

                {users.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">Ro'yxatdan o'tgan foydalanuvchilar mavjud emas.</p>
                )}
              </div>
            </div>
          )}

          {/* KATEGORIYA VA MAHSULOTLAR TAB */}
          {activeTab === 'categories' && (
            <div className="space-y-8">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                <h2 className="text-lg font-bold mb-4">Kategoriya Yaratish</h2>
                <form onSubmit={handleAddCategory} className="flex gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="Kategoriya nomi..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#06B6D4]"
                  />
                  <button type="submit" className="bg-[#06B6D4] hover:bg-cyan-400 text-black font-bold px-6 py-2.5 rounded-xl text-sm transition-all">
                    Qo'shish
                  </button>
                </form>

                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center gap-2 bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-xl text-sm">
                      <span>{cat.name}</span>
                      <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-400 hover:text-red-300 font-bold ml-1">&times;</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mahsulotlar Ro'yxati */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold">Mahsulotlar Ro'yxati ({products.length})</h2>
                  <button
                    onClick={() => handleOpenProductModal()}
                    className="bg-[#06B6D4] hover:bg-cyan-400 text-black font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-1 transition-all"
                  >
                    <FiPlus /> Mahsulot Qo'shish
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between bg-slate-950 border border-slate-800 p-4 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <img src={product.image} alt={product.title} className="w-14 h-14 object-cover rounded-xl bg-slate-800" />
                        <div>
                          <h3 className="font-bold text-sm text-white">{product.title}</h3>
                          <div className="flex gap-3 text-xs text-gray-400 mt-1">
                            <span>Narx: <b className="text-[#06B6D4]">${product.price}</b></span>
                            <span>Kategoriya: <b className="text-gray-200">{product.category}</b></span>
                            <span>Reyting: ⭐ {product.rating}</span>
                          </div>
                          {product.description && (
                            <p className="text-xs text-gray-500 line-clamp-1 mt-1 max-w-md">{product.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenProductModal(product)}
                          className="p-2.5 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500 hover:text-black rounded-xl text-sm transition-all"
                          title="Tahrirlash"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-sm transition-all"
                          title="O'chirish"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">Hozircha mahsulotlar mavjud emas.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* BUYURTMALAR TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white">Mijoz: {order.userName}</h3>
                    <p className="text-xs text-gray-400">Manzil: {order.address}</p>
                    <p className="text-xs text-gray-400">Tel: {order.phone}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-[#06B6D4]">${order.totalPrice}</span>
                    {order.status === 'approved' ? (
                      <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><FiCheckCircle /> Tasdiqlandi</span>
                    ) : (
                      <button onClick={() => handleApproveOrder(order.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all">
                        Tasdiqlash
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="text-gray-500 text-sm">Buyurtmalar mavjud emas.</p>}
            </div>
          )}

          {/* BANNER TAB */}
          {activeTab === 'banners' && (
            <div>
              <button onClick={() => setShowBannerModal(true)} className="bg-[#06B6D4] hover:bg-cyan-400 text-black font-bold px-5 py-2.5 rounded-xl text-sm mb-6 flex items-center gap-2 transition-all">
                <FiPlus /> Swiperga Rasm Qo'shish
              </button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {banners.map((b, idx) => (
                  <div key={idx} className="relative group rounded-2xl overflow-hidden border border-slate-800">
                    <img src={b} alt="Banner" className="w-full h-40 object-cover" />
                    <button onClick={() => handleDeleteBanner(idx)} className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-xl text-white transition-all">
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MAHSULOT QO'SHISH / TAHRIRLASH MODALI */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">
              {editingProduct ? "Mahsulotni O'zgartirish" : "Yangi Mahsulot Qo'shish"}
            </h3>
            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Rasm yuklash</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, (base64) => setNewProduct({ ...newProduct, image: base64 }))}
                  className="w-full text-xs text-gray-400"
                  required={!editingProduct}
                />
                {newProduct.image && (
                  <img src={newProduct.image} alt="Preview" className="w-16 h-16 object-cover rounded-xl mt-2 border border-slate-700" />
                )}
              </div>

              <input
                type="text"
                placeholder="Reyting (masalan: 5.0)"
                value={newProduct.rating}
                onChange={(e) => setNewProduct({ ...newProduct, rating: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-[#06B6D4]"
              />
              <input
                type="text"
                placeholder="Nomi"
                value={newProduct.title}
                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-[#06B6D4]"
                required
              />
              <input
                type="number"
                placeholder="Narxi ($)"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-[#06B6D4]"
                required
              />
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-[#06B6D4]"
                required
              >
                <option value="">Kategoriya tanlang...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Mahsulot Tavsifi (Batafsil)</label>
                <textarea
                  rows="4"
                  placeholder="Mahsulot haqida ma'lumot va xususiyatlarni kiriting..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-[#06B6D4] resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 text-xs text-gray-400 hover:text-white"
                >
                  Bekor qilish
                </button>
                <button type="submit" className="bg-[#06B6D4] hover:bg-cyan-400 text-black px-4 py-2 rounded-xl text-xs font-bold transition-all">
                  {editingProduct ? "Saqlash" : "Qo'shish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BANNER MODALI */}
      {showBannerModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-4">Swiperga Rasm Yuklash</h3>
            <form onSubmit={handleAddBanner} className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, (base64) => setNewBannerImage(base64))}
                className="w-full text-xs text-gray-400"
                required
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowBannerModal(false)} className="px-4 py-2 text-xs text-gray-400 hover:text-white">
                  Bekor qilish
                </button>
                <button type="submit" className="bg-[#06B6D4] hover:bg-cyan-400 text-black px-4 py-2 rounded-xl text-xs font-bold transition-all">
                  Yuklash
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

export default AdminPage;