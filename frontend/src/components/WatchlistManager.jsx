import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Activity, 
  X, 
  Loader2, 
  Layers,
  ExternalLink,
  Search
} from 'lucide-react';

const WatchlistManager = () => {
    const [watchlists, setWatchlists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingWatchlistId, setEditingWatchlistId] = useState(null);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL ||  'http://localhost:3001/api';

    useEffect(() => {
        fetchWatchlists();
    }, []);

    const fetchWatchlists = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/watchlists`);
            setWatchlists(response.data);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to fetch.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdateWatchlist = async (data) => {
        setLoading(true);
        const symbolsArray = data.symbols.split(',').map(s => s.trim().toUpperCase()).filter(s => s);
        try {
            if (editingWatchlistId) {
                await axios.put(`${API_BASE_URL}/watchlists/${editingWatchlistId}`, { symbols: symbolsArray });
                toast.success('List Updated', { style: { borderRadius: '10px', background: '#1e293b', color: '#fff' } });
                setEditingWatchlistId(null);
            } else {
                await axios.post(`${API_BASE_URL}/watchlists`, { name: data.name, symbols: symbolsArray });
                toast.success('List Created');
            }
            reset();
            fetchWatchlists();
        } catch (error) {
            toast.error('Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const startEditing = (watchlist) => {
        setEditingWatchlistId(watchlist._id);
        setValue('name', watchlist.name);
        setValue('symbols', watchlist.symbols.join(', '));
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-10 font-sans">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Area */}
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                            <Activity className="text-cyan-400" size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                Stock Watcher
                            </h1>
                            <p className="text-slate-500 text-sm font-medium tracking-wide">PORTFOLIO INTELLIGENCE</p>
                        </div>
                    </div>
                    
                    {/* <div className="flex gap-3">
                        <div className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl flex items-center gap-2 text-sm text-slate-400">
                            <Search size={16} />
                            <span>Quick Search...</span>
                        </div>
                    </div> */}
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Sidebar Form - Glass Card */}
                    <div className="lg:col-span-4">
                        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-8 rounded-3xl shadow-2xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl -z-10"></div>
                            
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
                                {editingWatchlistId ? <Pencil size={20} className="text-amber-400" /> : <Plus size={22} className="text-cyan-400" />}
                                {editingWatchlistId ? 'Modify Watchlist' : 'Add New List'}
                            </h2>

                            <form onSubmit={handleSubmit(handleCreateOrUpdateWatchlist)} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">List Name</label>
                                    <input
                                        type="text"
                                        {...register('name', { required: true })}
                                        disabled={!!editingWatchlistId}
                                        className={`w-full bg-slate-900/50 border ${errors.name ? 'border-red-500' : 'border-slate-700'} focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 rounded-xl px-4 py-3 outline-none transition-all disabled:opacity-50`}
                                        placeholder="e.g. Crypto Gems"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Stock Symbols</label>
                                    <textarea
                                        rows="4"
                                        {...register('symbols', { required: true })}
                                        className="w-full bg-slate-900/50 border border-slate-700 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 rounded-xl px-4 py-3 outline-none transition-all resize-none"
                                        placeholder="AAPL, TSLA, BTC..."
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 active:scale-95"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : (editingWatchlistId ? 'Save Changes' : 'Create List')}
                                    </button>
                                    {editingWatchlistId && (
                                        <button 
                                            onClick={() => { setEditingWatchlistId(null); reset(); }}
                                            className="px-4 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-lg font-medium text-slate-400 flex items-center gap-2">
                                <Layers size={18} />
                                Active Watchlists
                            </h2>
                        </div>

                        {watchlists.length === 0 ? (
                            <div className="bg-slate-800/20 border-2 border-dashed border-slate-800 rounded-3xl py-20 text-center">
                                <p className="text-slate-600">No watchlists found. Start by adding one!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {watchlists.map((list) => (
                                    <div 
                                        key={list._id} 
                                        className="bg-slate-800/30 border border-slate-700/50 p-6 rounded-2xl hover:border-cyan-500/30 hover:bg-slate-800/50 transition-all group relative overflow-hidden"
                                    >
                                        {/* Action Buttons (Top Right) */}
                                        <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => startEditing(list)} className="p-2 hover:text-amber-400 text-slate-500 transition-colors"><Pencil size={16}/></button>
                                            <button className="p-2 hover:text-red-400 text-slate-500 transition-colors"><Trash2 size={16}/></button>
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                            {list.name}
                                        </h3>
                                        
                                        <div className="flex flex-wrap gap-2">
                                            {list.symbols.map((symbol, i) => (
                                                <Link 
                                                    key={i} 
                                                    to={`/stocks/${symbol}`}
                                                    className="px-3 py-1.5 bg-slate-900/80 hover:bg-cyan-500 hover:text-white border border-slate-700 rounded-lg text-xs font-bold text-cyan-400 transition-all flex items-center gap-1.5"
                                                >
                                                    {symbol}
                                                    <ExternalLink size={10} className="opacity-50" />
                                                </Link>
                                            ))}
                                        </div>
                                        
                                        {/* <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            <span>{list.symbols.length} Assets</span>
                                            <span className="text-cyan-500/50 hover:text-cyan-400 cursor-pointer">View Analytics →</span>
                                        </div> */}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WatchlistManager;