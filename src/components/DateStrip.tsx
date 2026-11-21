import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateStripProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onOpenCalendar: () => void;
}

export const DateStrip: React.FC<DateStripProps> = ({ selectedDate, onSelectDate, onOpenCalendar }) => {
  // Generate date list: yesterday, today, tomorrow, + 3 days
  const today = new Date();
  const dates = [-1, 0, 1, 2, 3].map((offset) => {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    const dateStr = d.toISOString().split('T')[0];

    let label = '';
    if (offset === -1) label = 'YESTERDAY';
    else if (offset === 0) label = 'TODAY';
    else if (offset === 1) label = 'TOMORROW';
    else {
      label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
    }

    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = d.getDate();

    return { dateStr, label, dayName, dayNumber, isToday: offset === 0 };
  });

  return (
    <div className="bg-slate-950/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {dates.map((d) => {
            const isSelected = selectedDate === d.dateStr;
            return (
              <button
                key={d.dateStr}
                onClick={() => onSelectDate(d.dateStr)}
                className={`flex flex-col items-center px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800/80 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span className="text-[10px] uppercase font-semibold opacity-80">{d.label}</span>
                <span className="text-xs font-mono font-black mt-0.5">{d.dayNumber} {d.dayName}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenCalendar}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/40 text-xs font-bold transition-all shadow-sm"
            title="Open month-view calendar modal to jump to any date"
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Calendar</span>
          </button>

          <button
            onClick={() => {
              const current = new Date(selectedDate);
              current.setDate(current.getDate() - 1);
              onSelectDate(current.toISOString().split('T')[0]);
            }}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const current = new Date(selectedDate);
              current.setDate(current.getDate() + 1);
              onSelectDate(current.toISOString().split('T')[0]);
            }}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
