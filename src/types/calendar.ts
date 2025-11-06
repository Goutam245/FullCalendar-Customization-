export interface CalendarSettings {
  loggedin: boolean;
  uid: number;
  weeknumbers: boolean;
  weekdayinitials: boolean;
  daynavigator: boolean;
  weeknavigator: boolean;
  monthnavigator: boolean;
  yearnavigator: boolean;
}

export interface CalendarEvent {
  id: string;
  uid: number;
  title: string;
  category?: string;
  start: string;
  end: string;
  color: string;
  photo?: string;
  url?: string;
}

export interface FruitImage {
  id: number;
  name: string;
  image: string;
  description?: string;
  url?: string;
}

export type ViewType = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'multiMonthYear';
