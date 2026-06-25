'use client';

import { useState } from 'react';
import { PopulatedEvent } from '@/actions/calendar';
import CalendarGrid from './CalendarGrid';
import UpcomingEvents from './UpcomingEvents';
import EventCreationForm from './EventCreationForm';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const CalendarContent = ({
  householdId,
  eventsArray,
}: {
  householdId: string;
  eventsArray: PopulatedEvent[];
}) => {
  const [events, setEvents] = useState(eventsArray);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const handleEventAdded = (event: any) => {
    setEvents(prev =>
      [...prev, event].sort(
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
      )
    );
  };

  const goToPrevMonth = () =>
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));

  const goToNextMonth = () =>
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  const monthLabel = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="w-full space-y-8">

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Calendar 📅</h3>
          <p className="text-gray-500">{monthLabel}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={goToPrevMonth}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white hover:bg-gray-100 shadow-sm border border-gray-200"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={goToNextMonth}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white hover:bg-gray-100 shadow-sm border border-gray-200"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <button className="rounded-full bg-[#4CAF6D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#429960]">
                + Add event
              </button>
            </DialogTrigger>

            <DialogContent className="bg-white rounded-[28px]">
              <DialogHeader>
                <DialogTitle>Add Event</DialogTitle>
              </DialogHeader>

              <EventCreationForm
                householdId={householdId}
                onSuccess={() => setOpenDialog(false)}
                onEventAdded={handleEventAdded}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <CalendarGrid events={events} currentMonth={currentMonth} />

      <UpcomingEvents events={events} />

    </div>
  );
};

export default CalendarContent;
