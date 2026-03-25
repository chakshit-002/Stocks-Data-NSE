import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import MultiDatePicker from './MultiDatePicker'
import {
    Database,
    Search,
    Zap,
    Calendar,
    TrendingUp,
    ChevronRight,
    Activity,
    Layout
} from 'lucide-react';

const DEFAULT_STOCKS = [
    'TATAPOWER', 'ADANIPOWER', 'IREDA', 'PFC', 'RECLTD', 'NHPC', 'JSWENERGY', 'TITAGARH',
    'IRCON', 'BEML', 'RITES', 'RVNL', 'JWL', 'RAILTEL', 'TEXRAIL', 'TRANSRAILL', 'HAL', 'BEL', 'MAZDOCK', 'BDL', 'COCHINSHIP', 'GRSE', 'PARAS', 'ZENTEC', 'APOLLO',
    'MTARTECH', 'DATAPATTNS', 'KRISHNADEF', 'CPPLUS', 'SYRMA', 'MICEL', 'AVALON', 'CENTUM', 'MOSCHIP', 'KAYNES', 'AMBER', 'TATAELXSI', 'DIXON', 'DCXINDIA', 'PGEL',
    'CGPOWER', 'FIVESTAR', 'BAJAJHFL', 'SHRIRAMFIN', 'LICI', 'GICRE', 'AAVAS', 'SHANTIGOLD', 'JSWCEMENT', 'LOTUSDEV', 'VMM', 'VIKRAN', 'HBLENGINE', 'ADANIENSOL',
    'ADANIPORTS', 'ADANIGREEN', 'RELIANCE', 'RTNPOWER', 'TCS', 'INFY', 'ICICIBANK', 'HDFCBANK', 'SBIN', 'SJS', 'LUMAXTECH', 'NEWGEN', 'ZENSARTECH', 'HAPPSTMNDS',
    'BHEL', 'SERVOTECH', 'BPCL', 'TEJASNET', 'TATAMOTORS', 'GRAVITA', 'NETWEB', 'GESHIP', 'SCI', 'KCPSUGIND', 'INFIBEAM', 'GREENPOWER', 'OSWALPUMPS', 'SHAKTIPUMP',
    'SHABLY', 'PROSTARM', 'IRFC', 'TDPOWERSYS', 'BBOX', 'BLACKBUCK', 'EXIDEIND', 'ARE&M', 'COALINDIA', 'WAAREEENER', 'WAAREERTL', 'PREMIERENE', 'SWSOLAR',
    'TORNTPOWER', 'NTPCGREEN', 'EXICOM', 'HDBFS', 'CDSL', 'BSE', 'KFINTECH', 'MOTILALOFS', 'ANGELONE', 'ANANDRATHI', 'CAMS'
];
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL ||  'http://localhost:3001/api';

const HomePage = () => { 
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [watchlists, setWatchlists] = useState([]);

    // const { register: registerBulk, handleSubmit: handleSubmitBulk, formState: { errors: errorsBulk } } = useForm();
    const { register: registerStock, handleSubmit: handleSubmitStock, formState: { errors: errorsStock } } = useForm();
    const { register: registerOnDemand, handleSubmit: handleSubmitOnDemand, formState: { errors: errorsOnDemand } } = useForm();

    const { register: registerBulk, handleSubmit: handleSubmitBulk, setValue: setBulkValue, watch: watchBulk, formState: { errors: errorsBulk } } = useForm();
    const bulkDates = watchBulk('dates', '');

    useEffect(() => {
        const fetchWatchlists = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/watchlists`);
                setWatchlists(response.data);
            } catch (error) {
                toast.error(error.response?.data?.error || 'Failed to fetch watchlists.');
            }
        };
        fetchWatchlists();
    }, []);

    const handleBulkSave = async (data) => {
        setLoading(true);
        const dates = data.dates.split(',').map(d => d.trim()).filter(d => d);
        if (dates.length === 0) {
            toast.error('Please enter at least one date.');
            setLoading(false);
            return;
        }
        const payload = { dates };
        if (data.watchlistId) payload.watchlistId = data.watchlistId;

        try {
            const response = await axios.post(`${API_BASE_URL}/bulk-save`, payload);
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save data.');
        } finally {
            setLoading(false);
        }
    };

    const handleStockSearch = (data) => {
        navigate(`/stocks/${data.symbol}`);
    };

    const handleOnDemandFetchAndSave = async (data) => {
        const { symbol, date } = data;
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/fetch-and-save?symbol=${symbol}&date=${date}`);
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to fetch and save data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans p-4 md:p-8">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto text-center mb-12">
                <div className="inline-flex items-center justify-center p-2 bg-blue-500/10 rounded-full mb-4">
                    <Activity className="text-blue-400 mr-2" size={20} />
                    <span className="text-blue-400 text-sm font-medium px-2">Market Sync Active</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                    Stock <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Dashboard</span> 🚀
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Analyze, fetch, and synchronize NSE market data with a single click.
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">

                {/* Card 1: Bulk Sync - Updated UI */}
                <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-slate-700 transition-all">
                    <div className="flex items-center mb-6 text-blue-400">
                        <Database className="mr-3" size={24} />
                        <h2 className="text-xl font-bold text-white">Bulk Data Sync</h2>
                    </div>
                    <form onSubmit={handleSubmitBulk(handleBulkSave)} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Select or Type Dates</label>

                            {/* Humara Naya Component */}
                            <MultiDatePicker
                                value={bulkDates}
                                onDatesChange={(newVal) => setBulkValue('dates', newVal)}
                            />

                            {/* Hidden or Manual Input - Dono kaam karega */}
                            <input
                                type="text"
                                {...registerBulk('dates', { required: 'Please select at least one date' })}
                                className="w-full mt-2 bg-transparent border-b border-slate-800 py-1 text-[10px] text-slate-500 focus:outline-none focus:border-blue-500"
                                placeholder="Or type: 21092025, 20092025"
                            />
                            {errorsBulk.dates && <p className="text-red-400 text-xs mt-1">{errorsBulk.dates.message}</p>}
                        </div>

                        {/* Watchlist Select (Wahi purana) */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Target Watchlist</label>
                            <div className="relative">
                                <Layout className="absolute left-3 top-3 text-slate-500" size={18} />
                                <select
                                    {...registerBulk('watchlistId')}
                                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                                >
                                    <option value="">Default Stocks ({DEFAULT_STOCKS.length})</option>
                                    {watchlists.map(list => (
                                        <option key={list._id} value={list._id}>{list.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <span className="animate-spin text-lg">🌀</span> : <Zap size={18} />}
                            {loading ? 'Syncing...' : 'Sync Bulk Data'}
                        </button>
                    </form>
                </div>

                {/* Card 2: Quick Search */}
                <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-slate-700 transition-all">
                    <div className="flex items-center mb-6 text-emerald-400">
                        <Search className="mr-3" size={24} />
                        <h2 className="text-xl font-bold text-white">Quick Analysis</h2>
                    </div>
                    <form onSubmit={handleSubmitStock(handleStockSearch)} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Stock Symbol</label>
                            <div className="relative">
                                <TrendingUp className="absolute left-3 top-3 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    {...registerStock('symbol', { required: 'Symbol is required' })}
                                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all uppercase"
                                    placeholder="e.g. RELIANCE"
                                />
                            </div>
                            {errorsStock.symbol && <p className="text-red-400 text-xs mt-1">{errorsStock.symbol.message}</p>}
                        </div>
                        <div className="h-[76px] flex items-end"> {/* Spacer to align buttons */}
                            <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                                <Search size={18} />
                                View Charts & Data
                            </button>
                        </div>
                    </form>
                </div>

                {/* Card 3: On-Demand */}
                <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-slate-700 transition-all">
                    <div className="flex items-center mb-6 text-amber-400">
                        <Zap className="mr-3" size={24} />
                        <h2 className="text-xl font-bold text-white">Specific Fetch</h2>
                    </div>
                    <form onSubmit={handleSubmitOnDemand(handleOnDemandFetchAndSave)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Symbol</label>
                                <input
                                    type="text"
                                    {...registerOnDemand('symbol', { required: 'Symbol is required' })}
                                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none uppercase transition-all"
                                />
                                {errorsOnDemand.symbol && <p className="text-red-400 text-xs mt-1">{errorsOnDemand.symbol.message}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Date</label>
                                <input
                                    type="text"
                                    {...registerOnDemand('date', { required: 'Date is required' })}
                                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                    placeholder="DDMMYYYY"
                                />
                                {errorsOnDemand.date && <p className="text-red-400 text-xs mt-1">{errorsOnDemand.date.message}</p>}
                            </div>
                        </div>
                        <button
                            disabled={loading}
                            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-amber-900/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Processing...' : 'Force Sync Now'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Default Stocks Grid Section */}
            <div className="max-w-7xl mx-auto bg-[#1e293b]/50 border border-slate-800 rounded-2xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Layout className="text-blue-400" />
                        Default Portfolio ({DEFAULT_STOCKS.length})
                    </h2>
                    <div className="hidden sm:block text-slate-500 text-sm">Click any symbol to view details</div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                    {DEFAULT_STOCKS.map((stock, index) => (
                        <Link
                            key={index}
                            to={`/stocks/${stock}`}
                            className="group relative bg-[#0f172a] border border-slate-800 hover:border-blue-500/50 p-3 rounded-xl text-center transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-blue-500/5 translate-y-12 group-hover:translate-y-0 transition-transform duration-300"></div>
                            <span className="relative z-10 text-xs font-bold text-slate-400 group-hover:text-blue-400 transition-colors uppercase tracking-wider">
                                {stock}
                            </span>
                            <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight size={12} className="text-blue-400" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;