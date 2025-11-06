import React from 'react';
import { CalendarEvent } from '@/types/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CustomWeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick: (date: Date) => void;
}

export const CustomWeekView = ({
  currentDate,
  events,
  onEventClick,
  onTimeSlotClick,
}: CustomWeekViewProps) => {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const weekDays: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    weekDays.push(day);
  }

  const getEventsForDay = (date: Date): CalendarEvent[] => {
    const dateStr = date.toISOString().split('T')[0];
    return events
      .filter((e) => e.start.startsWith(dateStr))
      .sort((a, b) => a.start.localeCompare(b.start));
  };

  // Get week number
  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  return (
    <div className="border rounded-lg bg-card">
      {weekDays.map((day, idx) => {
        const dayEvents = getEventsForDay(day);
        const dayName = day.toLocaleDateString('en-US', { weekday: 'short' });
        const dateNum = day.getDate();
        const weekNum = getWeekNumber(day);
        const isToday = day.toDateString() === new Date().toDateString();

        return (
          <div
            key={idx}
            className={`flex border-b last:border-b-0 ${isToday ? 'bg-primary/5' : ''}`}
            style={{ minHeight: '100px' }}
          >
            {/* Left: Day label with week number */}
            <div className="w-20 border-r flex flex-col items-center justify-center py-2">
              <div className="font-semibold text-base">{dayName}</div>
              <div className="text-2xl font-bold">{dateNum}</div>
              {idx === 0 && (
                <div className="text-xs text-muted-foreground mt-1">W{weekNum}</div>
              )}
            </div>

            {/* Right: Events box */}
            <div className="flex-1 relative">
              <ScrollArea className="h-full w-full">
                <div
                  className="p-3 space-y-1.5 cursor-pointer min-h-[100px]"
                  onClick={() => onTimeSlotClick(day)}
                >
                  {dayEvents.length === 0 ? (
                    <div className="text-xs text-muted-foreground italic">
                      {/* Empty space for clicking */}
                    </div>
                  ) : (
                    dayEvents.map((event) => (
                      <button
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        className="flex items-center gap-2 text-left w-full px-2 py-1 rounded hover:bg-secondary/50 transition-colors"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: event.color }}
                        />
                        <span className="text-xs font-medium">
                          {new Date(event.start).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </span>
                        <span className="text-xs truncate">{event.title}</span>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        );
      })}
    </div>
  );
};
