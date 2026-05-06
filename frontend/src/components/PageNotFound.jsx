import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const PageNotFound = () => {
    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
            <div className="text-center">
                <AlertTriangle size={64} className="text-amber-500 mx-auto mb-6" />
                <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                <p className="text-slate-400 text-xl mb-8">Bhai, galat raste aa gaye! Ye page exist nahi karta.</p>
                <Link 
                    to="/" 
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all"
                >
                    <Home size={20} /> Wapas Home Par Chalo
                </Link>
            </div>
        </div>
    );
};

export default PageNotFound;