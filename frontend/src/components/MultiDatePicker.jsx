import React, { useState } from 'react';
import { Calendar as CalendarIcon, X, Plus } from 'lucide-react';
import moment from 'moment';

const MultiDatePicker = ({ onDatesChange, value }) => {
    const [selectedDate, setSelectedDate] = useState('');

    const handleAddDate = (e) => {
        const date = e.target.value; // Format: YYYY-MM-DD
        if (!date) return;

        const formatted = moment(date).format('DDMMYYYY');
        
        // Purani dates ko array mein badlo
        const currentDates = value ? value.split(',').map(d => d.trim()).filter(d => d) : [];
        
        if (!currentDates.includes(formatted)) {
            const newDates = [...currentDates, formatted].join(', ');
            onDatesChange(newDates);
        }
        setSelectedDate(''); // Reset picker
    };

    const removeDate = (dateToRemove) => {
        const currentDates = value.split(',').map(d => d.trim());
        const filtered = currentDates.filter(d => d !== dateToRemove).join(', ');
        onDatesChange(filtered);
    };

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <CalendarIcon className="absolute left-3 top-3 text-slate-500" size={18} />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={handleAddDate}
                        className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-400"
                    />
                </div>
            </div>

            {/* Selected Dates Badges */}
            {value && (
                <div className="flex flex-wrap gap-2 p-2 bg-slate-950/50 rounded-xl border border-slate-800/50">
                    {value.split(',').map(d => d.trim()).filter(d => d).map((date, idx) => (
                        <span key={idx} className="flex items-center gap-1 bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-1 rounded-lg border border-blue-500/30">
                            {moment(date, 'DDMMYYYY').format('DD MMM YYYY')}
                            <button type="button" onClick={() => removeDate(date)} className="hover:text-red-400">
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiDatePicker;