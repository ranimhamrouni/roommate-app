import { PopulatedEvent } from '@/actions/calendar';
import Initials from '../home/Initials';

const EventCard = ({
  event,
}: {
  event: PopulatedEvent;
}) => {
  return (
    <div className="rounded-[28px] bg-white p-6 flex items-center justify-between">

      <div>

        <h4 className="font-semibold">
          {event.title}
        </h4>

        <p className="text-sm text-gray-500">
          {new Date(event.date).toLocaleDateString(
            'en-TN',
            {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            }
          )}
          {' • '}
          {event.time}
        </p>

        {event.description && (
          <p className="text-sm text-gray-400 mt-1">
            {event.description}
          </p>
        )}

      </div>

      <Initials
        name={event.createdBy.name}
      />

    </div>
  );
};

export default EventCard;