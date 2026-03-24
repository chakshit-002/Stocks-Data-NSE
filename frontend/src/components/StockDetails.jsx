import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import {
    ArrowLeft, Plus, History, Table as TableIcon, X,
    ChevronRight, Loader2, PlusCircle, TrendingUp, List, BarChart2,
    Activity
} from 'lucide-react';
import DeliveryAnalytics from './DeliveryAnalytics';

// --- IMPORT CHART COMPONENT (Assuming it's in the same file or imported) ---

const API_BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:3001/api';

const StockDetails = () => {
    const { symbol } = useParams();
    const navigate = useNavigate();
    const [stockData, setStockData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [watchlists, setWatchlists] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [activeTab, setActiveTab] = useState('analytics'); // NEW: For toggling Graph/Table
    const isMobile = window.innerWidth < 768;
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const stockResponse = await axios.get(`${API_BASE_URL}/stocks/${symbol}`);
                setStockData(stockResponse.data);
                const watchlistResponse = await axios.get(`${API_BASE_URL}/watchlists`);
                setWatchlists(watchlistResponse.data);
            } catch (error) {
                toast.error('Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [symbol]);

    const handleAddToWatchlist = async (data) => {
        const { watchlistId, newWatchlistName } = data;
        let targetWatchlistId = watchlistId;
        const currentSymbol = symbol.toUpperCase();

        try {
            setLoading(true);
            if (newWatchlistName) {
                const res = await axios.post(`${API_BASE_URL}/watchlists`, { name: newWatchlistName, symbols: [currentSymbol] });
                targetWatchlistId = res.data._id;
                toast.success(`Created & Added to ${newWatchlistName}`);
            } else if (targetWatchlistId) {
                const selected = watchlists.find(wl => wl._id === targetWatchlistId);
                if (selected && !selected.symbols.includes(currentSymbol)) {
                    await axios.put(`${API_BASE_URL}/watchlists/${targetWatchlistId}`, { symbols: [...selected.symbols, currentSymbol] });
                    toast.success(`Added to ${selected.name}`);
                } else {
                    toast.error('Already in watchlist');
                }
            }
            setShowAddModal(false);
            reset();
            const updatedWL = await axios.get(`${API_BASE_URL}/watchlists`);
            setWatchlists(updatedWL.data);
        } catch (error) {
            toast.error('Action failed');
        } finally {
            setLoading(false);
        }
    };

    if (loading && stockData.length === 0) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        );
    }
    console.log(stockData);
    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 pb-24 md:pb-8 font-sans">
            <div className="max-w-7xl mx-auto p-4 md:p-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group w-fit"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </button>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95"
                    >
                        <Plus size={20} /> Add to Watchlist
                    </button>
                </div>

                {/* Stock Title Card */}
                {/* Stock Title Card & Tab Switcher */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] md:rounded-[3rem] p-4 md:p-8 mb-6 md:mb-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">

                    {/* Symbol Section */}
                    <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto group">
                        <div className="relative">
                            {/* Outer Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[1.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

                            <div className="relative h-14 w-14 md:h-20 md:w-20 bg-slate-950 rounded-[1.2rem] md:rounded-[1.8rem] flex items-center justify-center border border-white/10 shadow-2xl">
                                <TrendingUp size={isMobile ? 24 : 36} className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <h1 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                                {symbol}
                            </h1>
                            {/* <div className="flex items-center gap-2 mt-2 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg w-fit">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-[9px] md:text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Live Market Pulse</span>
                            </div> */}
                        </div>
                    </div>

                    {/* Modern Tab Switcher */}
                    <div className="flex max-[364px]:flex-col bg-slate-950/80 p-1.5 rounded-[1.2rem] md:rounded-[1.5rem] border border-white/5 w-full gap-2 justify-end sm:gap-4 md:gap-12 shadow-2xl relative overflow-hidden">
                        {/* Subtle background glow for buttons */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent pointer-events-none"></div>

                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 md:gap-5 px-2 md:px-4 py-3 md:py-4 rounded-[1rem] text-[10px] md:text-xs font-black uppercase tracking-[0.15em] transition-all duration-500 relative z-10 ${activeTab === 'analytics'
                                ? 'bg-indigo-600 text-white shadow-[0_10px_25px_-5px_rgba(79,70,229,0.5)] scale-[1.02]'
                                : 'text-slate-500 hover:text-slate-200'
                                }`}
                        >
                            <Activity size={isMobile ? 14 : 18} strokeWidth={3} />
                            <span className='max-[400px]:text-[11px]'>Analytics</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('table')}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 md:gap-3 px-4 md:px-10 py-3 md:py-4 rounded-[1rem] text-[10px] md:text-xs font-black uppercase tracking-[0.15em] transition-all duration-500 relative z-10 ${activeTab === 'table'
                                ? 'bg-indigo-600 text-white shadow-[0_10px_25px_-5px_rgba(79,70,229,0.5)] scale-[1.02]'
                                : 'text-slate-500 hover:text-slate-200'
                                }`}
                        >
                            <History size={isMobile ? 14 : 18} strokeWidth={3} />
                            <span className="whitespace-nowrap max-[400px]:text-[11px]">Logs</span>
                        </button>
                    </div>
                </div>

                {/* --- CONTENT SWITCHER --- */}

                {activeTab === 'analytics' ? (
                    /* 1. NEW COMPONENT: Graph View */
                    <div className="animate-in fade-in duration-500">
                        <DeliveryAnalytics data={stockData} />
                    </div>
                ) : (
                    /* 2. EXISTING COMPONENT: Table/Card View */
                    <div className="animate-in fade-in duration-500">
                        {/* Mobile View: Data Cards */}
                        <div className="block lg:hidden space-y-4">
                            {stockData.length === 0 ? (
                                <p className="text-center text-slate-500 italic">No data found.</p>
                            ) : (
                                stockData.map((data, index) => (
                                    <div key={index} className="bg-[#1e293b] border border-slate-800 rounded-2xl p-5 shadow-lg">
                                        <div className="flex justify-between items-center mb-4 border-b border-slate-700/50 pb-3">
                                            <span className="text-blue-400 font-bold">{moment(data.date).format('DD MMM YYYY')}</span>
                                            <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${parseFloat(data.deliveryPercent) > 50 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-300'
                                                }`}>
                                                Delivery {data.deliveryPercent}%
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Price Range</p>
                                                <p className="text-sm text-white font-semibold">{data.open} - {data.close}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">High / Low</p>
                                                <p className="text-sm text-slate-300">{data.high} / {data.low}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Trades</p>
                                                <p className="text-sm text-slate-300 font-mono">{data.noOfTrade.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Turnover (Lac)</p>
                                                <p className="text-sm text-emerald-400 font-mono">₹{data.turnOverLac}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Total Volume</p>
                                                <p className="text-sm text-white font-mono">{data.volume.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Deliv. Volume</p>
                                                <p className="text-sm text-indigo-400 font-mono">{data.delivery.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Desktop View: Clean Table */}
                        <div className="hidden lg:block bg-[#1e293b] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#0f172a] border-b border-slate-800">
                                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Open - Close</th>
                                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase">High - Low</th>
                                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Trades</th>
                                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Turnover (L)</th>
                                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Total Volume</th>
                                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Deliv. Volume</th>
                                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Delivery %</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {stockData.map((data, index) => (
                                        <tr key={index} className="hover:bg-slate-800/50 transition-colors group">
                                            <td className="p-4 text-sm font-medium text-blue-400">
                                                {moment(data.date).format('DD-MM-YYYY')}
                                            </td>
                                            <td className="p-4 text-sm">
                                                <span className="text-slate-300">{data.open}</span>
                                                <ChevronRight size={12} className="inline mx-2 text-slate-600" />
                                                <span className="text-white font-semibold">{data.close}</span>
                                            </td>
                                            <td className="p-4 text-sm text-slate-400">
                                                {data.high} / {data.low}
                                            </td>
                                            <td className="p-4 text-sm text-center text-slate-300">
                                                {data.noOfTrade.toLocaleString()}
                                            </td>
                                            <td className="p-4 text-sm text-right text-emerald-400 font-mono">
                                                {data.turnOverLac}
                                            </td>
                                            <td className="p-4 text-sm text-right text-slate-300 font-mono">
                                                {data.volume.toLocaleString()}
                                            </td>
                                            <td className="p-4 text-sm text-right text-indigo-400 font-mono">
                                                {data.delivery.toLocaleString()}
                                            </td>
                                            <td className="p-4 text-sm text-right">
                                                <span className={`px-2 py-1 rounded-md text-xs font-bold ${parseFloat(data.deliveryPercent) > 50 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-700 text-slate-300'
                                                    }`}>
                                                    {data.deliveryPercent}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Sticky Bottom Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0f172a]/90 backdrop-blur-md border-t border-slate-800 md:hidden z-40">
                <button
                    onClick={() => setShowAddModal(true)}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-900/40 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                    <PlusCircle size={20} /> Add {symbol} to Watchlist
                </button>
            </div>

            {/* Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
                    <div className="relative bg-[#1e293b] w-full max-w-md rounded-t-[32px] md:rounded-3xl p-8 shadow-2xl animate-in slide-in-from-bottom md:zoom-in duration-300">
                        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-6 md:hidden"></div>

                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2"><List className="text-blue-500" /> Watchlist Settings</h3>
                            <button onClick={() => setShowAddModal(false)} className="hidden md:block text-slate-500 hover:text-white"><X /></button>
                        </div>

                        <form onSubmit={handleSubmit(handleAddToWatchlist)} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase px-1">Choose Existing</label>
                                <select {...register('watchlistId')} className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-4 px-4 text-white outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Select Watchlist...</option>
                                    {watchlists.map(list => <option key={list._id} value={list._id}>{list.name}</option>)}
                                </select>
                            </div>

                            <div className="relative flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                                <span className="relative bg-[#1e293b] px-3 text-[10px] text-slate-500 font-bold uppercase">OR</span>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase px-1">New Watchlist</label>
                                <input type="text" {...register('newWatchlistName')} placeholder="Enter Name..." className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-4 px-4 text-white outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>

                            <button type="submit" className="w-full bg-blue-600 py-4 rounded-xl font-bold text-white shadow-lg shadow-blue-900/20 active:scale-95 transition-all">
                                {loading ? 'Processing...' : 'Add Symbol Now'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockDetails;