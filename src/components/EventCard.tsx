import { Bell, Calendar, Clock, MapPin, Pencil, Trash2 } from 'lucide-react';
import type { CalendarEvent } from '../lib/types';
import { ALARM_PRESETS } from '../lib/types';

interface EventCardProps {
  event: CalendarEvent;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('de-AT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatAlarm(minutes: number): string {
  const preset = ALARM_PRESETS.find((p) => p.minutes === minutes);
  if (preset) return preset.label;
  if (minutes < 60) return `${minutes} Min`;
  if (minutes < 1440) return `${Math.round(minutes / 60)} Std`;
  if (minutes < 10080) return `${Math.round(minutes / 1440)} Tag(e)`;
  return `${Math.round(minutes / 10080)} Woche(n)`;
}

const Chip = ({
  icon,
  label,
  color = '#6E6E73',
  bg = 'rgba(120,120,128,0.10)',
}: {
  icon: React.ReactNode;
  label: string;
  color?: string;
  bg?: string;
}) => (
  <span
    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-medium leading-none"
    style={{ background: bg, color }}
  >
    {icon}
    {label}
  </span>
);

export default function EventCard({ event, onEdit, onDelete, index }: EventCardProps) {
  const hasAlarm = event.alarmMinutesBefore !== undefined;

  return (
    <div
      className="animate-fade-up bg-white rounded-2xl overflow-hidden card-shadow"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Top accent bar */}
      <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #007AFF, #0055D4)' }} />

      <div className="p-4">
        {/* Title + actions */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3
            className="font-semibold text-[16px] leading-snug flex-1 min-w-0"
            style={{ color: '#1C1C1E' }}
          >
            {event.title}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0 -mr-1">
            <button
              onClick={() => onEdit(event.id)}
              aria-label={`${event.title} bearbeiten`}
              className="w-8 h-8 flex items-center justify-center rounded-xl transition-colors duration-150 cursor-pointer"
              style={{ color: '#007AFF' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,122,255,0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
            <button
              onClick={() => onDelete(event.id)}
              aria-label={`${event.title} löschen`}
              className="w-8 h-8 flex items-center justify-center rounded-xl transition-colors duration-150 cursor-pointer"
              style={{ color: '#FF3B30' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,59,48,0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Chips row */}
        <div className="flex flex-wrap gap-1.5">
          {/* Date chip */}
          <Chip
            icon={<Calendar className="w-3 h-3" strokeWidth={2} />}
            label={
              event.startDate === event.endDate
                ? formatDate(event.startDate)
                : `${formatDate(event.startDate)} – ${formatDate(event.endDate)}`
            }
            color="#1C1C1E"
            bg="rgba(120,120,128,0.10)"
          />

          {/* Time chip */}
          {!event.allDay && event.startTime ? (
            <Chip
              icon={<Clock className="w-3 h-3" strokeWidth={2} />}
              label={`${event.startTime} – ${event.endTime}`}
              color="#3C3C43"
              bg="rgba(120,120,128,0.10)"
            />
          ) : event.allDay ? (
            <Chip
              icon={<Clock className="w-3 h-3" strokeWidth={2} />}
              label="Ganztägig"
              color="#007AFF"
              bg="rgba(0,122,255,0.10)"
            />
          ) : null}

          {/* Location chip */}
          {event.location && (
            <Chip
              icon={<MapPin className="w-3 h-3" strokeWidth={2} />}
              label={event.location}
              color="#3C3C43"
              bg="rgba(120,120,128,0.10)"
            />
          )}

          {/* Alarm chip */}
          {hasAlarm && (
            <Chip
              icon={<Bell className="w-3 h-3" strokeWidth={2} />}
              label={formatAlarm(event.alarmMinutesBefore!)}
              color="#FF9500"
              bg="rgba(255,149,0,0.12)"
            />
          )}
        </div>
      </div>
    </div>
  );
}
