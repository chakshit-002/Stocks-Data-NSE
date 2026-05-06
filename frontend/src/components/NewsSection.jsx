import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Newspaper, ExternalLink, Info } from 'lucide-react';
import NewsCard from './NewsCard';


const NewsSection = ({ symbol }) => {
    const [newsList, setNewsList] = useState([]);
    const [visibleCount, setVisibleCount] = useState(6); // Pehle sirf 6 news dikhao
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/news/${symbol}`);
                setNewsList(res.data);
            } catch (err) {
                console.error("News load fail");
            } finally {
                setLoading(false);
            }
        };
        if (symbol) fetchNews();
    }, [symbol]);

    // "Show More" function
    const showMoreNews = () => {
        setVisibleCount(prev => prev + 6); // Har click par 6 aur badha do
    };

    if (loading) return <div className="text-slate-500">Loading News...</div>;

    return (
        <div className="mt-12 lg:">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                Latest News: {symbol}
            </h2>

            {/* List ko slice kar do: 0 se lekar visibleCount tak */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsList.slice(0, visibleCount).map((news, i) => (
                    <NewsCard key={i} news={news} />
                ))}
            </div>

            {/* Show More Button - Sirf tab dikhao jab aur news bachi ho */}
            {newsList.length > visibleCount && (
                <div className="mt-10 text-center">
                    <button 
                        onClick={showMoreNews}
                        className="bg-slate-800 hover:bg-slate-700 text-blue-400 px-8 py-3 rounded-xl font-bold border border-slate-700 transition-all active:scale-95"
                    >
                        Show More News
                    </button>
                    <p className="text-slate-500 text-xs mt-3">
                        Showing {visibleCount} of {newsList.length} articles
                    </p>
                </div>
            )}
        </div>
    );
};

 export default NewsSection;