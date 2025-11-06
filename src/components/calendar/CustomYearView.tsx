import React from 'react';
import { cn } from '@/lib/utils';

interface CustomYearViewProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

export const CustomYearView = ({
  currentDate,
  onDateSelect,
  selectedDate,
}: CustomYearViewProps) => {
  const year = currentDate.getFullYear();

  const getMonthData = (monthIndex: number) => {
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const days: Date[] = [];
    const current = new Date(startDate);

    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
      if (days.length > 42) break;
    }

    return days;
  };

  const renderMonth = (monthIndex: number) => {
    const days = getMonthData(monthIndex);
    const monthName = new Date(year, monthIndex, 1).toLocaleDateString('en-US', {
      month: 'long',
    });
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <div className="border rounded p-2 bg-card">
        <div className="text-center text-xs font-semibold mb-1">{monthName}</div>
        <div className="grid grid-cols-7 gap-0.5 mb-0.5">
          {weekdays.map((day, idx) => (
            <div key={idx} className="text-center text-[10px] text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="space-y-0.5">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 gap-0.5">
              {week.map((day, dayIdx) => {
                const isCurrentMonth = day.getMonth() === monthIndex;
                const isSelected = day.toDateString() === selectedDate.toDateString();
                const isToday = day.toDateString() === new Date().toDateString();

                return (
                  <button
                    key={dayIdx}
                    onClick={() => onDateSelect(day)}
                    className={cn(
                      'aspect-square flex items-center justify-center text-[10px] rounded transition-colors',
                      'hover:bg-secondary',
                      !isCurrentMonth && 'text-muted-foreground opacity-40',
                      isSelected &&
                        'bg-[hsl(var(--calendar-selected))] text-white hover:bg-[hsl(var(--calendar-selected))]',
                      isToday && !isSelected && 'font-bold text-[hsl(var(--calendar-today))]'
                    )}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-3 p-4">
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i}>{renderMonth(i)}</div>
      ))}
    </div>
  );
};
