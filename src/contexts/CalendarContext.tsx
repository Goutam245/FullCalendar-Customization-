import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CalendarSettings, CalendarEvent, FruitImage } from '@/types/calendar';
import appleImg from '@/assets/apple.png';
import apricotImg from '@/assets/apricot.png';
import bananaImg from '@/assets/banana.png';
import kiwiImg from '@/assets/kiwi.png';
import mangoImg from '@/assets/mango.png';
import orangeImg from '@/assets/orange.png';
import peachImg from '@/assets/peach.png';
import pearImg from '@/assets/pear.png';
import pomegranateImg from '@/assets/pomegranate.png';

interface CalendarContextType {
  settings: CalendarSettings;
  updateSettings: (settings: Partial<CalendarSettings>) => void;
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  fruitImages: FruitImage[];
  getCurrentImage: (date: Date) => FruitImage;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

const defaultSettings: CalendarSettings = {
  loggedin: false,
  uid: 1,
  weeknumbers: true,
  weekdayinitials: true,
  daynavigator: true,
  weeknavigator: true,
  monthnavigator: true,
  yearnavigator: true,
};

const fruitImagesData: FruitImage[] = [
  { id: 1, name: 'Apple', image: appleImg, description: 'A crisp and sweet red apple' },
  { id: 2, name: 'Apricot', image: apricotImg, description: 'A golden apricot with velvety skin' },
  { id: 3, name: 'Banana', image: bananaImg, description: 'A yellow banana full of potassium' },
  { id: 4, name: 'Kiwi', image: kiwiImg, description: 'A tangy kiwi with bright green flesh' },
  { id: 5, name: 'Mango', image: mangoImg, description: 'A popular variety found in the Caribbean and South American countries' },
  { id: 6, name: 'Orange', image: orangeImg, description: 'A juicy orange packed with vitamin C' },
  { id: 7, name: 'Peach', image: peachImg, description: 'A soft and fuzzy peach' },
  { id: 8, name: 'Pear', image: pearImg, description: 'A sweet yellow pear' },
  { id: 9, name: 'Pomegranate', image: pomegranateImg, description: 'A ruby red pomegranate with jeweled seeds' },
];

const sampleEvents: CalendarEvent[] = [
  {
    id: '1',
    uid: 1,
    title: 'Team Meeting',
    category: 'meeting',
    start: '2024-10-29T10:00:00',
    end: '2024-10-29T11:00:00',
    color: '#3788d8',
  },
  {
    id: '2',
    uid: 1,
    title: 'Client Call',
    category: 'phone',
    start: '2024-10-29T14:00:00',
    end: '2024-10-29T15:00:00',
    color: '#00ccff',
  },
  {
    id: '3',
    uid: 1,
    title: 'Lunch Break',
    start: '2024-10-30T12:00:00',
    end: '2024-10-30T13:00:00',
    color: '#34a853',
  },
];

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<CalendarSettings>(defaultSettings);
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const stored = localStorage.getItem('calendar-events');
    return stored ? JSON.parse(stored) : sampleEvents;
  });

  const updateSettings = (newSettings: Partial<CalendarSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    if (!settings.loggedin) {
      localStorage.setItem('calendar-events', JSON.stringify(updatedEvents));
    }
  };

  const updateEvent = (id: string, eventUpdate: Partial<CalendarEvent>) => {
    const updatedEvents = events.map((event) =>
      event.id === id ? { ...event, ...eventUpdate } : event
    );
    setEvents(updatedEvents);
    if (!settings.loggedin) {
      localStorage.setItem('calendar-events', JSON.stringify(updatedEvents));
    }
  };

  const deleteEvent = (id: string) => {
    const updatedEvents = events.filter((event) => event.id !== id);
    setEvents(updatedEvents);
    if (!settings.loggedin) {
      localStorage.setItem('calendar-events', JSON.stringify(updatedEvents));
    }
  };

  const getCurrentImage = (date: Date): FruitImage => {
    // Calculate day of year (1-365)
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    const imageIndex = (dayOfYear - 1) % fruitImagesData.length;
    
    // Check if any event on this date has a custom photo
    const dateStr = date.toISOString().split('T')[0];
    const eventsOnDate = events
      .filter(e => e.start.startsWith(dateStr) && e.photo)
      .sort((a, b) => a.start.localeCompare(b.start));
    
    if (eventsOnDate.length > 0 && eventsOnDate[0].photo) {
      return {
        id: 0,
        name: 'Custom',
        image: eventsOnDate[0].photo,
        url: eventsOnDate[0].url,
      };
    }
    
    return fruitImagesData[imageIndex];
  };

  return (
    <CalendarContext.Provider
      value={{
        settings,
        updateSettings,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        fruitImages: fruitImagesData,
        getCurrentImage,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within CalendarProvider');
  }
  return context;
};
