import { CalendarX2 } from 'lucide-react';
import type { CalendarEvent } from '../lib/types';
import EventCard from './EventCard';

interface EventListProps {
  events: CalendarEvent[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function EventList({ events, onEdit, onDelete }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div
          className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4"
          style={{ background: 'rgba(0,122,255,0.10)' }}
        >
          <CalendarX2 className="w-7 h-7" style={{ color: '#007AFF' }} strokeWidth={1.5} />
        </div>
        <p className="font-semibold text-[16px] mb-1" style={{ color: '#1C1C1E' }}>
          Noch keine Ereignisse
        </p>
        <p className="text-[14px]" style={{ color: '#6E6E73' }}>
          Füge dein erstes Ereignis hinzu,<br />um eine ICS-Datei zu erstellen.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1 mb-1">
        <span className="text-[13px] font-semibold uppercase tracking-wider" style={{ color: '#6E6E73' }}>
          Ereignisse
        </span>
        <span
          className="text-[12px] font-semibold rounded-full px-2 py-0.5"
          style={{ background: '#007AFF', color: '#fff' }}
        >
          {events.length}
        </span>
      </div>
      {events.map((event, index) => (
        <EventCard
          key={event.id}
          event={event}
          onEdit={onEdit}
          onDelete={onDelete}
          index={index}
        />
      ))}
    </div>
  );
}
