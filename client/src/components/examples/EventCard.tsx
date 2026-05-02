import EventCard from '../EventCard';
import concertImage from '@assets/generated_images/Concert_venue_event_0f0136d1.png';

export default function EventCardExample() {
  return (
    <div className="max-w-sm">
      <EventCard
        id="1"
        title="Live Concert Experience"
        date="2025-12-15T20:00:00"
        location="Madison Square Garden, New York"
        image={concertImage}
        ticketUrl="/events/1"
      />
    </div>
  );
}
