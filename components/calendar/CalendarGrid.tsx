'use client';

import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { PopulatedEvent } from '@/actions/calendar';

const CalendarGrid = ({
  events,
}: {
  events: PopulatedEvent[];
}) => {
  const [date, setDate] = useState<Date | undefined>(
    new Date()
  );

  return (
    <div className="rounded-[28px] bg-white p-6">

      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="w-full"
      />

    </div>
  );
};

export default CalendarGrid;