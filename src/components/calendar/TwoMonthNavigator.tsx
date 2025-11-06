import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TwoMonthNavigatorProps {
  currentDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  showWeekNumbers?: boolean;
  showWeekdayInitials?: boolean;
}

export const TwoMonthNavigator = ({
  currentDate,
  selectedDate,
  onDateSelect,
  showWeekNumbers = true,
  showWeekdayInitials = true,
}: TwoMonthNavigatorProps) => {
  const [navigatorDate, setNavigatorDate] = useState(new Date(currentDate));

  const getMonthData = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
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

  const getWeekNumber = (date: Date): number => {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  };

  const renderMonth = (monthDate: Date) => {
    const days = getMonthData(monthDate);
    const monthName = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <div className="flex-1">
        <div className="text-center text-sm font-semibold mb-2">{monthName}</div>
        {showWeekdayInitials && (
          <div className="grid grid-cols-7 gap-1 mb-1">
            {showWeekNumbers && <div className="w-5"></div>}
            {weekdays.map((day, idx) => (
              <div key={idx} className="text-center text-xs text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
        )}
        <div className="space-y-1">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 gap-1">
              {showWeekNumbers && weekIdx === 0 && (
                <div className="col-span-7 flex items-center">
                  <div className="w-5 text-center text-xs text-muted-foreground">
                    {getWeekNumber(week[0])}
                  </div>
                  <div className="flex-1 grid grid-cols-7 gap-1">
                    {week.map((day, dayIdx) => renderDay(day, dayIdx, monthDate))}
                  </div>
                </div>
              )}
              {showWeekNumbers && weekIdx > 0 && (
                <>
                  <div className="w-5 text-center text-xs text-muted-foreground flex items-center justify-center">
                    {getWeekNumber(week[0])}
                  </div>
                  {week.map((day, dayIdx) => renderDay(day, dayIdx, monthDate))}
                </>
              )}
              {!showWeekNumbers && week.map((day, dayIdx) => renderDay(day, dayIdx, monthDate))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDay = (day: Date, idx: number, monthDate: Date) => {
    const isCurrentMonth = day.getMonth() === monthDate.getMonth();
    const isSelected = day.toDateString() === selectedDate.toDateString();
    const isToday = day.toDateString() === new Date().toDateString();

    return (
      <button
        key={idx}
        onClick={() => onDateSelect(day)}
        className={cn(
          'aspect-square flex items-center justify-center text-xs rounded transition-colors',
          'hover:bg-secondary',
          !isCurrentMonth && 'text-muted-foreground opacity-50',
          isSelected && 'bg-[hsl(var(--calendar-selected))] text-white hover:bg-[hsl(var(--calendar-selected))]',
          isToday && !isSelected && 'font-bold text-[hsl(var(--calendar-today))]'
        )}
      >
        {day.getDate()}
      </button>
    );
  };

  const nextMonth = new Date(navigatorDate);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const handlePrevMonth = () => {
    const newDate = new Date(navigatorDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setNavigatorDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(navigatorDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setNavigatorDate(newDate);
  };

  return (
    <div className="bg-card border rounded-lg p-4 h-fit">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-1 hover:bg-secondary rounded"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={handleNextMonth}
          className="p-1 hover:bg-secondary rounded"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="flex gap-4">
        {renderMonth(navigatorDate)}
        {renderMonth(nextMonth)}
      </div>
    </div>
  );
};
