import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, LayoutList, TrendingUp } from 'lucide-react'; // Lucide icons

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="bg-[#1e293b] border-b border-[#334155] sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo Section */}
                    <div className="flex items-center gap-2">
                        <div className="bg-[#3b82f6] p-1.5 rounded-lg">
                            <TrendingUp size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-[#38bdf8] to-[#818cf8] bg-clip-text text-transparent">
                            StockTracker
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <Link 
                            to="/" 
                            className="flex items-center gap-2 text-[#94a3b8] hover:text-[#38bdf8] transition-colors font-medium text-sm"
                        >
                            <Home size={18} />
                            Home
                        </Link>
                        <Link 
                            to="/watchlists" 
                            className="flex items-center gap-2 text-[#94a3b8] hover:text-[#38bdf8] transition-colors font-medium text-sm"
                        >
                            <LayoutList size={18} />
                            Manage Watchlists
                        </Link>
                    </nav>

                    {/* Mobile Hamburger Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="text-[#94a3b8] hover:text-white focus:outline-none p-2 rounded-md transition-colors"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu (Dropdown) */}
            <div 
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-[#1e293b] border-t border-[#334155] ${
                    isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="px-4 pt-2 pb-4 space-y-2 shadow-inner">
                    <Link
                        to="/"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg text-[#94a3b8] hover:bg-[#0f172a] hover:text-white transition-all"
                    >
                        <Home size={20} />
                        <span className="font-medium">Home</span>
                    </Link>
                    <Link
                        to="/watchlists"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg text-[#94a3b8] hover:bg-[#0f172a] hover:text-white transition-all"
                    >
                        <LayoutList size={20} />
                        <span className="font-medium">Manage Watchlists</span>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;