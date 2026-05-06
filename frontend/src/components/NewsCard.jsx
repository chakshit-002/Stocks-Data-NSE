import { Newspaper, ExternalLink, Clock } from 'lucide-react';

const NewsCard = ({ news }) => {
    return (
        <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-5 hover:border-blue-500/50 transition-all group">
            <div className="flex justify-between items-start mb-3">
                <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-1 rounded uppercase">
                    {news.source || 'News Update'}
                </span>
                <span className="text-slate-500 text-[10px] flex items-center gap-1">
                    <Clock size={12} /> {news.date || 'Recent'}
                </span>
            </div>
            
            <h3 className="text-white font-bold text-sm mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                {news.title}
            </h3>
            
            <p className="text-slate-400 text-xs mb-4 line-clamp-2">
                {news.description || 'Click read more to view full article details and market impact.'}
            </p>
            
            <a 
                href={news.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 text-xs font-bold hover:text-blue-300 transition-colors"
            >
                Read Full Story <ExternalLink size={14} />
            </a>
        </div>
    );
};

export default NewsCard;