import { PopulatedEvent } from '@/actions/calendar';
import EventCard from './EventCard';

const UpcomingEvents = ({
  events,
}: {
  events: PopulatedEvent[];
}) => {
  const upcoming = [...events].sort(
    (a, b) =>
      new Date(a.date).getTime() -
      new Date(b.date).getTime()
  );

  return (
    <div>

      <h3 className="text-2xl font-bold mb-4">
        Upcoming Events
      </h3>

      {upcoming.length === 0 ? (
        <div className="rounded-[28px] bg-white p-10 text-center text-gray-500">
          No upcoming events.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {upcoming.map(event => (
            <EventCard
              key={event._id.toString()}
              event={event}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default UpcomingEvents;