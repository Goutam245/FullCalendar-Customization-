import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useCalendar } from '@/contexts/CalendarContext';
import { TwoMonthNavigator } from '@/components/calendar/TwoMonthNavigator';
import { EventModal } from '@/components/calendar/EventModal';
import { CustomNavigationBar } from '@/components/calendar/CustomNavigationBar';
import { FruitImageDisplay } from '@/components/calendar/FruitImageDisplay';
import { CustomWeekView } from '@/components/calendar/CustomWeekView';
import { CustomYearView } from '@/components/calendar/CustomYearView';
import { ViewType } from '@/types/calendar';
import { DateSelectArg, EventClickArg, EventContentArg } from '@fullcalendar/core';

const Calendar = () => {
  const { settings, events, addEvent, updateEvent, deleteEvent, getCurrentImage } = useCalendar();
  const [currentView, setCurrentView] = useState<ViewType>('timeGridDay');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [modalStart, setModalStart] = useState<Date>();
  const [modalEnd, setModalEnd] = useState<Date>();
  const [currentImage, setCurrentImage] = useState(getCurrentImage(new Date()));
  const calendarRef = useRef<FullCalendar>(null);

  // Update fruit image when date changes
  useEffect(() => {
    setCurrentImage(getCurrentImage(selectedDate));
  }, [selectedDate, events, getCurrentImage]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setModalStart(selectInfo.start);
    setModalEnd(selectInfo.end);
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = events.find((e) => e.id === clickInfo.event.id);
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleCustomEventClick = (event: any) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleCustomTimeSlotClick = (date: Date) => {
    setModalStart(date);
    const end = new Date(date);
    end.setHours(date.getHours() + 1);
    setModalEnd(end);
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  const handleNavigatorDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date);
    if (calendarRef.current && currentView !== 'timeGridWeek' && currentView !== 'multiMonthYear') {
      calendarRef.current.getApi().gotoDate(date);
    }
  };

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    if (calendarRef.current && view !== 'timeGridWeek' && view !== 'multiMonthYear') {
      calendarRef.current.getApi().changeView(view);
    }
  };

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
    setSelectedDate(date);
    if (calendarRef.current && currentView !== 'timeGridWeek' && currentView !== 'multiMonthYear') {
      calendarRef.current.getApi().gotoDate(date);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    if (calendarRef.current && currentView !== 'timeGridWeek' && currentView !== 'multiMonthYear') {
      calendarRef.current.getApi().today();
    }
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    const event = events.find((e) => e.id === eventInfo.event.id);
    const isTimeGrid = currentView === 'timeGridDay' || currentView === 'timeGridWeek';
    const isDayGrid = currentView === 'dayGridMonth';

    if (isTimeGrid && currentView === 'timeGridDay') {
      return (
        <div className="flex items-center gap-2 p-1">
          <div
            className="w-1 h-full"
            style={{ backgroundColor: event?.color || '#3788d8' }}
          />
          {event?.category && (
            <span className="text-sm">
              {event.category === 'meeting' && '👥'}
              {event.category === 'phone' && '📞'}
              {event.category === 'appointment' && '📅'}
              {event.category === 'alarm' && '⏰'}
            </span>
          )}
          <div className="text-sm">{eventInfo.event.title}</div>
        </div>
      );
    }

    if (isDayGrid || currentView === 'timeGridWeek') {
      return (
        <div className="flex items-center gap-1 text-xs">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: event?.color || '#3788d8' }}
          />
          <span className="font-medium">{eventInfo.timeText}</span>
          <span>{eventInfo.event.title}</span>
        </div>
      );
    }

    return <div className="text-xs">{eventInfo.event.title}</div>;
  };

  const showNavigator =
    (currentView === 'timeGridDay' && settings.daynavigator) ||
    (currentView === 'timeGridWeek' && settings.weeknavigator) ||
    (currentView === 'dayGridMonth' && settings.monthnavigator) ||
    (currentView === 'multiMonthYear' && settings.yearnavigator);

  return (
    <div className="min-h-screen bg-background">
      <CustomNavigationBar
        currentDate={currentDate}
        view={currentView}
        onViewChange={handleViewChange}
        onDateChange={handleDateChange}
        onToday={handleToday}
      />

      <div className="flex gap-4 p-4">
        <div className={showNavigator ? 'w-1/2' : 'w-full'}>
          {currentView === 'timeGridWeek' ? (
            <CustomWeekView
              currentDate={currentDate}
              events={events}
              onEventClick={handleCustomEventClick}
              onTimeSlotClick={handleCustomTimeSlotClick}
            />
          ) : currentView === 'multiMonthYear' ? (
            <CustomYearView
              currentDate={currentDate}
              onDateSelect={handleNavigatorDateSelect}
              selectedDate={selectedDate}
            />
          ) : (
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView={currentView}
              headerToolbar={false}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              events={events.map((e) => ({
                id: e.id,
                title: e.title,
                start: e.start,
                end: e.end,
                backgroundColor: 'transparent',
                borderColor: e.color,
                textColor: '#000',
              }))}
              select={handleDateSelect}
              eventClick={handleEventClick}
              eventContent={renderEventContent}
              height="calc(100vh - 180px)"
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
            />
          )}
        </div>

        {showNavigator && (
          <div className="w-[420px] space-y-4">
            <FruitImageDisplay image={currentImage} />
            <TwoMonthNavigator
              currentDate={currentDate}
              selectedDate={selectedDate}
              onDateSelect={handleNavigatorDateSelect}
              showWeekNumbers={settings.weeknumbers}
              showWeekdayInitials={settings.weekdayinitials}
            />
          </div>
        )}
      </div>

      <EventModal
        open={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        start={modalStart}
        end={modalEnd}
        onSave={(event) => {
          if (selectedEvent) {
            updateEvent(selectedEvent.id, event);
          } else {
            addEvent(event);
          }
        }}
        onDelete={deleteEvent}
        uid={settings.uid}
      />
    </div>
  );
};

export default Calendar;
