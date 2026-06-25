'use client';

import { PopulatedEvent } from '@/actions/calendar';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const EVENT_COLORS = [
  'bg-cyan-100 text-cyan-900',
  'bg-purple-100 text-purple-900',
  'bg-emerald-100 text-emerald-900',
  'bg-orange-100 text-orange-900',
  'bg-rose-100 text-rose-900',
];

function eventColorClass(id: string): string {
  let n = 0;
  for (const c of id) n = (n * 31 + c.charCodeAt(0)) & 0xff;
  return EVENT_COLORS[n % EVENT_COLORS.length];
}

const CalendarGrid = ({
  events,
  currentMonth,
}: {
  events: PopulatedEvent[];
  currentMonth: Date;
}) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const now = new Date();
  const isToday = (day: number) =>
    now.getFullYear() === year &&
    now.getMonth() === month &&
    now.getDate() === day;

  const eventsByDay: Record<number, PopulatedEvent[]> = {};
  for (const event of events) {
    const d = new Date(event.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      (eventsByDay[day] ??= []).push(event);
    }
  }

  const cells: (number | null)[] = [];
  for (let i = 0; i < 42; i++) {
    const day = i - firstDayOfWeek + 1;
    cells.push(day >= 1 && day <= daysInMonth ? day : null);
  }

  return (
    <div className="rounded-[28px] bg-white overflow-hidden border border-gray-100">
      <div className="grid grid-cols-7 border-b border-gray-200">
        {WEEKDAYS.map(d => (
          <div key={d} className="py-3 text-center text-sm font-medium text-gray-400">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          const dayEvents = day ? (eventsByDay[day] ?? []) : [];
          const isLastRow = i >= 35;
          const isLastCol = (i + 1) % 7 === 0;
          return (
            <div
              key={i}
              className={`min-h-[90px] p-2 ${!isLastCol ? 'border-r' : ''} ${!isLastRow ? 'border-b' : ''} border-gray-100`}
            >
              {day !== null && (
                <>
                  <div className="mb-1">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${
                        isToday(day)
                          ? 'bg-[#4CAF6D] text-white'
                          : 'text-gray-700'
                      }`}
                    >
                      {day}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event._id.toString()}
                        className={`truncate rounded-full px-2 py-0.5 text-xs font-medium ${eventColorClass(event._id.toString())}`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-400 px-1">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
