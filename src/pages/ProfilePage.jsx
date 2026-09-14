import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiUser, FiMail, FiLogOut, FiShoppingBag, FiCheckCircle, FiClock, FiEdit, FiPhone, FiCamera } from 'react-icons/fi';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myOrders, setMyOrders] = useState([]);

  // Tahrirlash holatlari
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('savat_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setEditName(userData.name || '');
      setEditPhone(userData.phone || '');
      setEditAvatar(userData.avatar || '');

      const allOrders = JSON.parse(localStorage.getItem('savat_orders')) || [];
      const filteredOrders = allOrders.filter(
        (order) => order.userId === userData.id || order.userName === userData.name
      );
      setMyOrders(filteredOrders);
    } else {
      navigate('/');
    }
  }, [navigate]);

  // Profil rasmini fayldan yuklash
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Profilni saqlash
  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      name: editName,
      phone: editPhone,
      avatar: editAvatar
    };

    setUser(updatedUser);
    localStorage.setItem('savat_user', JSON.stringify(updatedUser));
    setIsEditing(false);
    alert("Profil ma'lumotlari muvaffaqiyatli yangilandi!");
  };

  const handleLogout = () => {
    localStorage.removeItem('savat_user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-darkBg text-white flex flex-col justify-between">
      <div>
        <Navbar user={user} onLogout={handleLogout} />

        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-cardBg border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8">
            
            {/* Profil Sarlavhasi va Tahrirlash tugmasi */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-8">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl bg-brandBlue/20 border border-brandBlue flex items-center justify-center text-neonCyan text-3xl font-bold overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name ? user.name.charAt(0).toUpperCase() : 'U'
                    )}
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                  <p className="text-gray-400 text-sm mt-1">Foydalanuvchi ID: #{id}</p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl border border-slate-700 transition-all text-xs font-semibold"
              >
                <FiEdit /> {isEditing ? "Tahrirlashni yopish" : "Profilni tahrirlash"}
              </button>
            </div>

            {/* TAHRIRLASH FORMASI */}
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h2 className="text-base font-bold text-neonCyan mb-4">Profil ma'lumotlarini o'zgartirish</h2>
                
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Ism-sharif</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brandBlue"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">Telefon raqam</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brandBlue"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">Profil rasmini tanlang (Fayldan)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-gray-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">Yoki Rasm URL manzili</label>
                  <input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brandBlue"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-xs text-gray-400 hover:text-white"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="bg-brandBlue hover:bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    Saqlash
                  </button>
                </div>
              </form>
            ) : (
              /* Shaxsiy Ma'lumotlar Bo'limi */
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-neonCyan">Shaxsiy ma'lumotlar</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                    <FiUser className="text-brandBlue text-xl" />
                    <div>
                      <span className="text-xs text-gray-500 block">Ism-sharif</span>
                      <span className="text-sm font-semibold text-white">{user.name}</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                    <FiMail className="text-brandBlue text-xl" />
                    <div>
                      <span className="text-xs text-gray-500 block">Email pochta</span>
                      <span className="text-sm font-semibold text-white">{user.email}</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                    <FiPhone className="text-brandBlue text-xl" />
                    <div>
                      <span className="text-xs text-gray-500 block">Telefon raqam</span>
                      <span className="text-sm font-semibold text-white">{user.phone || "Kiritilmagan"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Buyurtmalar Holati Bo'limi */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h2 className="text-lg font-bold text-neonCyan flex items-center gap-2">
                <FiShoppingBag /> Buyurtmalarim va Bildirishnomalar
              </h2>

              {myOrders.length === 0 ? (
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-center text-gray-400 text-sm">
                  Sizda hali hech qanday buyurtmalar mavjud emas.
                </div>
              ) : (
                <div className="space-y-3">
                  {myOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-slate-700"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-500">Buyurtma ID: #{order.id}</span>
                          <span className="text-xs font-bold text-neonCyan">${order.totalPrice}</span>
                        </div>
                        <p className="text-xs text-gray-300">
                          Manzil: <span className="text-gray-400">{order.address || "Kiritilmagan"}</span>
                        </p>
                      </div>

                      {order.status === 'approved' ? (
                        <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                          <FiCheckCircle size={16} />
                          <span>{order.message || "Sizning buyurtmangiz tasdiqlandi"}</span>
                        </div>
                      ) : (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                          <FiClock size={16} />
                          <span>Ko'rib chiqilmoqda...</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chiqish Tugmasi */}
            <div className="pt-6 border-t border-slate-800 flex justify-end">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white px-5 py-2.5 rounded-xl transition-all text-sm font-semibold"
              >
                <FiLogOut /> Tizimdan chiqish
              </button>
            </div>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;