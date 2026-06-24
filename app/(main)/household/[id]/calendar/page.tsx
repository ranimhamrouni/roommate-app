import { getEvents } from "@/actions/calendar";
import CalendarContent from "@/components/calendar/CalendarContent";

const page = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const result = await getEvents(id);

  if (!result.success) return <p>{result.error}</p>;

  return (
    <CalendarContent
      householdId={id}
      eventsArray={result.events}
    />
  );
};

export default page;