import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewType } from '@/types/calendar';

interface CustomNavigationBarProps {
  currentDate: Date;
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  onDateChange: (date: Date) => void;
  onToday: () => void;
}

export const CustomNavigationBar = ({
  currentDate,
  view,
  onViewChange,
  onDateChange,
  onToday,
}: CustomNavigationBarProps) => {
  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (view === 'timeGridDay') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === 'timeGridWeek') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (view === 'dayGridMonth') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === 'multiMonthYear') {
      newDate.setFullYear(newDate.getFullYear() - 1);
    }
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'timeGridDay') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === 'timeGridWeek') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (view === 'dayGridMonth') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === 'multiMonthYear') {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    onDateChange(newDate);
  };

  const getDateDisplay = () => {
    if (view === 'timeGridDay') {
      return currentDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } else if (view === 'timeGridWeek') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else if (view === 'dayGridMonth') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else {
      return currentDate.getFullYear().toString();
    }
  };

  return (
    <div className="bg-card border-b p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrev}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={handleNext}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-xl font-bold text-[hsl(var(--calendar-nav-text))]">
          {getDateDisplay()}
        </div>

        <div className="flex gap-2">
          <Button
            variant={view === 'timeGridDay' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('timeGridDay')}
          >
            <Clock className="w-4 h-4 mr-1" />
            Day
          </Button>
          <Button
            variant={view === 'timeGridWeek' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('timeGridWeek')}
          >
            <Calendar className="w-4 h-4 mr-1" />
            Week
          </Button>
          <Button
            variant={view === 'dayGridMonth' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('dayGridMonth')}
          >
            <Calendar className="w-4 h-4 mr-1" />
            Month
          </Button>
          <Button
            variant={view === 'multiMonthYear' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('multiMonthYear')}
          >
            <Calendar className="w-4 h-4 mr-1" />
            Year
          </Button>
        </div>
      </div>
    </div>
  );
};
