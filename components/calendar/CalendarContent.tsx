'use client';

import { useState } from 'react';
import { PopulatedEvent } from '@/actions/calendar';
import CalendarGrid from './CalendarGrid';
import UpcomingEvents from './UpcomingEvents';
import EventCreationForm from './EventCreationForm';

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

  const handleEventAdded = (event: any) => {
    setEvents(prev =>
      [...prev, event].sort(
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
      )
    );
  };

  return (
    <div className="w-full space-y-8">

      <div className="flex justify-between items-center">

        <div>
          <h3 className="text-2xl font-bold">
            Calendar 📅
          </h3>

          <p className="text-gray-500">
            Household events
          </p>
        </div>

        <Dialog
          open={openDialog}
          onOpenChange={setOpenDialog}
        >
          <DialogTrigger asChild>
            <button className="rounded-full bg-[#4CAF6D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#429960]">
              + Add Event
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

      <CalendarGrid events={events} />

      <UpcomingEvents events={events} />

    </div>
  );
};

export default CalendarContent;