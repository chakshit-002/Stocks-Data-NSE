// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Menu, X, Home, LayoutList, TrendingUp } from 'lucide-react'; // Lucide icons

// const Header = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const navigate = useNavigate();
//     const toggleMenu = () => {
//         setIsOpen(!isOpen);
//     };

//     return (
//         <header className="bg-[#1e293b] border-b border-[#334155] sticky top-0 z-50 shadow-lg">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex items-center justify-between h-16">
//                     {/* Logo Section */}
//                     <div className="flex items-center gap-2" >
//                         <div className="bg-[#3b82f6] p-1.5 rounded-lg cursor-pointer" onClick={() => navigate('/')}>
//                             <TrendingUp size={20} className="text-white" />
//                         </div>
//                         <span onClick={() => navigate('/')} className=" cursor-pointer text-xl font-bold bg-gradient-to-r from-[#38bdf8] to-[#818cf8] bg-clip-text text-transparent">
//                             StockTracker
//                         </span>
//                     </div>

//                     {/* Desktop Navigation */}
//                     <nav className="hidden md:flex space-x-8">
//                         <Link 
//                             to="/" 
//                             className="flex items-center gap-2 text-[#94a3b8] hover:text-[#38bdf8] transition-colors font-medium text-sm"
//                         >
//                             <Home size={18} />
//                             Home
//                         </Link>
//                         <Link 
//                             to="/watchlists" 
//                             className="flex items-center gap-2 text-[#94a3b8] hover:text-[#38bdf8] transition-colors font-medium text-sm"
//                         >
//                             <LayoutList size={18} />
//                             Manage Watchlists
//                         </Link>
//                     </nav>

//                     {/* Mobile Hamburger Button */}
//                     <div className="md:hidden flex items-center">
//                         <button
//                             onClick={toggleMenu}
//                             className="text-[#94a3b8] hover:text-white focus:outline-none p-2 rounded-md transition-colors"
//                         >
//                             {isOpen ? <X size={28} /> : <Menu size={28} />}
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Mobile Menu (Dropdown) */}
//             <div 
//                 className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-[#1e293b] border-t border-[#334155] ${
//                     isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
//                 }`}
//             >
//                 <div className="px-4 pt-2 pb-4 space-y-2 shadow-inner">
//                     <Link
//                         to="/"
//                         onClick={() => setIsOpen(false)}
//                         className="flex items-center gap-3 px-3 py-3 rounded-lg text-[#94a3b8] hover:bg-[#0f172a] hover:text-white transition-all"
//                     >
//                         <Home size={20} />
//                         <span className="font-medium">Home</span>
//                     </Link>
//                     <Link
//                         to="/watchlists"
//                         onClick={() => setIsOpen(false)}
//                         className="flex items-center gap-3 px-3 py-3 rounded-lg text-[#94a3b8] hover:bg-[#0f172a] hover:text-white transition-all"
//                     >
//                         <LayoutList size={20} />
//                         <span className="font-medium">Manage Watchlists</span>
//                     </Link>
//                 </div>
//             </div>
//         </header>
//     );
// };

// export default Header;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Home, LayoutList, TrendingUp, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Path check kar lena bhai

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false); // Modal state
    const { user, logout } = useAuth(); // Context se data nikala
    const navigate = useNavigate();

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleConfirmLogout = () => {
        logout();
        setShowLogoutModal(false);
    };

    return (
        <header className="bg-[#1e293b] border-b border-[#334155] sticky top-0 z-40 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo Section */}
                    <div className="flex items-center gap-2" >
                        <div className="bg-[#3b82f6] p-1.5 rounded-lg cursor-pointer" onClick={() => navigate('/')}>
                            <TrendingUp size={20} className="text-white" />
                        </div>
                        <span onClick={() => navigate('/')} className=" cursor-pointer text-xl font-bold bg-gradient-to-r from-[#38bdf8] to-[#818cf8] bg-clip-text text-transparent">
                            StockTracker
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="flex items-center gap-2 text-[#94a3b8] hover:text-[#38bdf8] transition-colors font-medium text-sm">
                            <Home size={18} /> Home
                        </Link>
                        <Link to="/watchlists" className="flex items-center gap-2 text-[#94a3b8] hover:text-[#38bdf8] transition-colors font-medium text-sm">
                            <LayoutList size={18} /> Manage Watchlists
                        </Link>

                        {/* Auth Buttons */}
                        <div className="pl-4 border-l border-slate-700">
                            {user ? (
                                <button 
                                    onClick={() => setShowLogoutModal(true)}
                                    className="flex items-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-1.5 rounded-lg transition-all text-sm font-bold border border-red-500/20"
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            ) : (
                                <Link 
                                    to="/login"
                                    className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-500 px-5 py-1.5 rounded-lg transition-all text-sm font-bold"
                                >
                                    <LogIn size={16} /> Login
                                </Link>
                            )}
                        </div>
                    </nav>

                    {/* Mobile Hamburger Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="text-[#94a3b8] hover:text-white p-2 transition-colors">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-[#1e293b] border-t border-[#334155] ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-4 pt-2 pb-4 space-y-2">
                    <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-lg text-[#94a3b8] hover:bg-[#0f172a] hover:text-white transition-all">
                        <Home size={20} /> <span className="font-medium">Home</span>
                    </Link>
                    <Link to="/watchlists" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-lg text-[#94a3b8] hover:bg-[#0f172a] hover:text-white transition-all">
                        <LayoutList size={20} /> <span className="font-medium">Manage Watchlists</span>
                    </Link>
                    {user ? (
                        <button onClick={() => { setIsOpen(false); setShowLogoutModal(true); }} className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
                            <LogOut size={20} /> <span className="font-medium">Logout</span>
                        </button>
                    ) : (
                        <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-all">
                            <LogIn size={20} /> <span className="font-medium">Login</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)}></div>
                    <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 w-full max-w-sm relative z-10 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-2">Logout Confirm?</h3>
                        <p className="text-slate-400 mb-6">Bhai, kya sach mein logout karna chahte ho?</p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold transition-all"
                            >
                                Nahi, Cancel
                            </button>
                            <button 
                                onClick={handleConfirmLogout}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-500 font-semibold transition-all shadow-lg shadow-red-900/20"
                            >
                                Haan, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;