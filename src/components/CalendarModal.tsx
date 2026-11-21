import React, { useState } from 'react';
import { Calendar as CalendarIcon, X, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSelectDate,
}) => {
  if (!isOpen) return null;

  const currentDateObj = selectedDate ? new Date(selectedDate) : new Date();
  const [viewYear, setViewYear] = useState(currentDateObj.getFullYear());
  const [viewMonth, setViewMonth] = useState(currentDateObj.getMonth()); // 0-11

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Calculate days in month
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleSelectDay = (dayNum: number, isCurrentMonth: boolean = true, isPrevMonth: boolean = false, isNextMonth: boolean = false) => {
    let targetYear = viewYear;
    let targetMonth = viewMonth;

    if (isPrevMonth) {
      if (viewMonth === 0) {
        targetMonth = 11;
        targetYear = viewYear - 1;
      } else {
        targetMonth = viewMonth - 1;
      }
    } else if (isNextMonth) {
      if (viewMonth === 11) {
        targetMonth = 0;
        targetYear = viewYear + 1;
      } else {
        targetMonth = viewMonth + 1;
      }
    }

    const mStr = String(targetMonth + 1).padStart(2, '0');
    const dStr = String(dayNum).padStart(2, '0');
    const dateStr = `${targetYear}-${mStr}-${dStr}`;

    onSelectDate(dateStr);
    onClose();
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Archive & Fixtures Calendar
              </h3>
              <span className="text-xs text-slate-400">Jump to past scores or future dates</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Body */}
        <div className="p-5 space-y-4">
          {/* Month & Year Navigation */}
          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-sm font-black text-white">
              {monthNames[viewMonth]} {viewYear}
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] text-slate-400 uppercase">
            {daysOfWeek.map((d, i) => (
              <div key={i} className="py-1">{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Previous month trailing days */}
            {Array.from({ length: firstDayOfMonth }).map((_, idx) => {
              const dayNum = daysInPrevMonth - firstDayOfMonth + idx + 1;
              return (
                <button
                  key={`prev-${idx}`}
                  onClick={() => handleSelectDay(dayNum, false, true, false)}
                  className="h-10 rounded-xl bg-slate-950/40 text-slate-600 text-xs font-medium flex items-center justify-center hover:bg-slate-800 hover:text-slate-300 transition-colors"
                >
                  {dayNum}
                </button>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const mStr = String(viewMonth + 1).padStart(2, '0');
              const dStr = String(dayNum).padStart(2, '0');
              const thisDateStr = `${viewYear}-${mStr}-${dStr}`;
              const isSelected = selectedDate === thisDateStr;
              const isToday = todayStr === thisDateStr;

              return (
                <button
                  key={`curr-${dayNum}`}
                  onClick={() => handleSelectDay(dayNum, true, false, false)}
                  className={`h-10 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 ring-2 ring-blue-400 scale-105'
                      : isToday
                      ? 'bg-slate-800 text-blue-400 border border-blue-500/50'
                      : 'bg-slate-950 text-slate-200 hover:bg-slate-800 hover:text-white border border-slate-800/80'
                  }`}
                >
                  <span>{dayNum}</span>
                  {isToday && <span className="w-1 h-1 rounded-full bg-blue-400 mt-0.5" />}
                </button>
              );
            })}

            {/* Next month leading days to fill 42 cells (6 rows) */}
            {(() => {
              const totalCellsSoFar = firstDayOfMonth + daysInMonth;
              const remainingCells = totalCellsSoFar <= 35 ? 35 - totalCellsSoFar : 42 - totalCellsSoFar;
              return Array.from({ length: remainingCells }).map((_, idx) => {
                const dayNum = idx + 1;
                return (
                  <button
                    key={`next-${idx}`}
                    onClick={() => handleSelectDay(dayNum, false, false, true)}
                    className="h-10 rounded-xl bg-slate-950/40 text-slate-600 text-xs font-medium flex items-center justify-center hover:bg-slate-800 hover:text-slate-300 transition-colors"
                  >
                    {dayNum}
                  </button>
                );
              });
            })()}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-t border-slate-800 text-xs">
          <button
            onClick={() => {
              onSelectDate(todayStr);
              onClose();
            }}
            className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
          >
            Jump to Today
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors border border-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
