import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiShield, 
  FiShoppingBag, 
  FiBox, 
  FiUsers, 
  FiBell, 
  FiHome, 
  FiLogOut, 
  FiMenu, 
  FiX 
} from 'react-icons/fi';

const AdminNavbar = ({ adminUser, onLogout }) => {
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // LocalStorage-dan buyurtmalarni tekshirib, tasdiqlanmagan (pending) buyurtmalar sonini hisoblash
    const updatePendingCount = () => {
      const orders = JSON.parse(localStorage.getItem('savat_orders')) || [];
      const pending = orders.filter(order => order.status === 'pending');
      setPendingOrdersCount(pending.length);
    };

    updatePendingCount();

    // LocalStorage o'zgarganda real-vaqtda hisoblab turish uchun interval
    const interval = setInterval(updatePendingCount, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('savat_admin');
      navigate('/login');
    }
  };

  // Navigatsiya havolalari
  const navLinks = [
    { title: "Buyurtmalar", path: "/admin/orders", icon: <FiShoppingBag size={18} />, badge: pendingOrdersCount },
    { title: "Mahsulotlar", path: "/admin/products", icon: <FiBox size={18} /> },
    { title: "Foydalanuvchilar", path: "/admin/users", icon: <FiUsers size={18} /> },
  ];

  return (
    <header className="bg-cardBg border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo va Admin Status */}
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-neonCyan/10 border border-neonCyan/40 flex items-center justify-center text-neonCyan font-black text-lg sm:text-xl shadow-lg shadow-neonCyan/10">
                <FiShield />
              </div>
              <div>
                <span className="font-extrabold text-white text-base sm:text-lg tracking-wide block leading-none">
                  ADMIN<span className="text-neonCyan">PANEL</span>
                </span>
                <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium tracking-wider block">
                  Boshqaruv Tizimi
                </span>
              </div>
            </Link>
          </div>

          {/* Ishchi stoli (Desktop) menyusi */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Yangi buyurtmalar qo'ng'iroqchasi */}
            <Link
              to="/admin/orders"
              className="relative p-2.5 text-gray-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-all"
              title="Yangi buyurtmalar"
            >
              <FiBell size={18} />
              {pendingOrdersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-cardBg">
                  {pendingOrdersCount}
                </span>
              )}
            </Link>

            {/* Do'konga qaytish tugmasi */}
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-all"
            >
              <FiHome size={15} />
              <span>Saytga o'tish</span>
            </Link>

            {/* Admin Avatar va Chiqish */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-xs">
                {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                title="Admin paneldan chiqish"
              >
                <FiLogOut size={18} />
              </button>
            </div>
          </div>

          {/* Mobil Menyu Tugmasi */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to="/admin/orders"
              className="relative p-2 text-gray-400 bg-slate-900 border border-slate-800 rounded-xl"
            >
              <FiBell size={18} />
              {pendingOrdersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {pendingOrdersCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
            >
              {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobil Menyu Kontenti */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 backdrop-blur-lg">
          <div className="space-y-1">
            {navLinks.map((link, idx) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={idx}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-[#06B6D4] text-white' 
                      : 'text-gray-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {link.icon}
                    <span>{link.title}</span>
                  </div>
                  {link.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white"
            >
              <FiHome size={16} /> Asosiy saytga qaytish
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20"
            >
              <FiLogOut size={14} /> Chiqish
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminNavbar;