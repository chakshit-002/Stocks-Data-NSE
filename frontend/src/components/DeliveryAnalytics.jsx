import React, { useState, useEffect } from 'react';
import { 
  Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, Line, ComposedChart, Cell 
} from 'recharts';
import { ChevronLeft, ChevronRight, BarChart3, Zap } from 'lucide-react';
import moment from 'moment';

const DeliveryAnalytics = ({ data }) => {
    // viewMode state ki ab zaroorat nahi kyunki sirf ek hi mode hai
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const chartData = [...data].reverse().map(item => ({
        ...item,
        formattedDate: moment(item.date).format('DD MMM'),
        deliveryQty: item.delivery, 
        totalVolume: item.volume,   
        deliveryPercentage: parseFloat(item.deliveryPercent) || 0
    }));

    // Items per view fixed hai
    const itemsPerPage = isMobile ? 6 : 12;
    const [startIndex, setStartIndex] = useState(Math.max(0, chartData.length - itemsPerPage));
    const currentData = chartData.slice(startIndex, startIndex + itemsPerPage);

    const handleNext = () => {
        if (startIndex + itemsPerPage < chartData.length) {
            setStartIndex(prev => Math.min(prev + 2, chartData.length - itemsPerPage));
        }
    };

    const handlePrev = () => {
        if (startIndex > 0) {
            setStartIndex(prev => Math.max(prev - 2, 0));
        }
    };

    return (
        <div className="w-full bg-slate-900/40 border border-white/10 rounded-[24px] md:rounded-[32px] p-4 md:p-8 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                        <Zap className="text-indigo-400" size={24} fill="currentColor" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
                            Market <span className="text-indigo-400">Insight</span>
                        </h2>
                        <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1 italic">
                           Historical Delivery Trends
                        </p>
                    </div>
                </div>
                {/* Weekly buttons removed from here */}
            </div>

            {/* Pagination & Date Info */}
            <div className="flex items-center justify-between mb-6 bg-white/5 p-3 rounded-2xl border border-white/5">
                <div className="px-2">
                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1 text-left">Active Range</p>
                    <p className="text-sm font-bold text-white tracking-tight">
                        {currentData[0]?.formattedDate} <span className="text-slate-600 mx-1">—</span> {currentData[currentData.length - 1]?.formattedDate}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handlePrev} disabled={startIndex === 0} className="group p-3 bg-slate-800/50 hover:bg-indigo-600 rounded-xl text-indigo-400 hover:text-white disabled:opacity-10 border border-white/5 transition-all active:scale-90"><ChevronLeft size={22}/></button>
                    <button onClick={handleNext} disabled={startIndex + itemsPerPage >= chartData.length} className="group p-3 bg-slate-800/50 hover:bg-indigo-600 rounded-xl text-indigo-400 hover:text-white disabled:opacity-10 border border-white/5 transition-all active:scale-90"><ChevronRight size={22}/></button>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[350px] md:h-[450px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={currentData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorDelivery" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9}/>
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.4}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" vertical={false} opacity={0.05} />
                        <XAxis 
                            dataKey="formattedDate" 
                            stroke="#94a3b8" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                            dy={15}
                            fontWeight="700"
                        />
                        <YAxis yAxisId="left" hide />
                        <YAxis 
                            yAxisId="right"
                            orientation="right"
                            stroke="#10b981" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                            domain={[0, 100]}
                            tickFormatter={(val) => `${val}%`}
                        />
                        
                        <Tooltip 
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', padding: '12px' }}
                        />
                        
                        <Legend verticalAlign="top" align="center" iconType="circle" wrapperStyle={{ paddingBottom: '30px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }} />

                        <Bar yAxisId="left" dataKey="totalVolume" name="Total Vol" fill="rgba(255,255,255,0.3)" radius={[8, 8, 0, 0]} barSize={isMobile ? 20 : 40} />
                        
                        <Bar yAxisId="left" dataKey="deliveryQty" name="Delivery Vol" fill="url(#colorDelivery)" radius={[8, 8, 0, 0]} barSize={isMobile ? 20 : 40}>
                            {currentData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fillOpacity={entry.deliveryPercentage > 40 ? 1 : 0.6} />
                            ))}
                        </Bar>

                        <Line 
                            yAxisId="right"
                            type="stepAfter" 
                            dataKey="deliveryPercentage" 
                            name="Delivery %" 
                            stroke="#10b981" 
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#0f172a' }}
                            activeDot={{ r: 6, shadow: '0 0 10px #10b981' }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DeliveryAnalytics;