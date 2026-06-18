import { createEvents } from 'ics';
import type { EventAttributes } from 'ics';
import type { CalendarEvent } from './types';

function toIcsTimeTuple(date: string, time: string): [number, number, number, number, number] {
  const [y, m, d] = date.split('-').map(Number);
  const [h, min] = time.split(':').map(Number);
  return [y, m, d, h, min];
}

function toIcsDateTuple(date: string): [number, number, number] {
  const [y, m, d] = date.split('-').map(Number);
  return [y, m, d];
}

// ICS spec: all-day end must be the day AFTER the last day
function addOneDay(tuple: [number, number, number]): [number, number, number] {
  const d = new Date(tuple[0], tuple[1] - 1, tuple[2] + 1);
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()];
}

function mapToEventAttributes(e: CalendarEvent): EventAttributes {
  const attrs: EventAttributes = {
    uid: `${e.id}@ics-creator.local`,
    title: e.title,
    startOutputType: 'local',
    start: e.allDay ? toIcsDateTuple(e.startDate) : toIcsTimeTuple(e.startDate, e.startTime),
    end: e.allDay
      ? addOneDay(toIcsDateTuple(e.endDate))
      : toIcsTimeTuple(e.endDate, e.endTime),
    calName: 'ICS Kalender-Ersteller',
  };

  if (e.location) attrs.location = e.location;
  if (e.description) attrs.description = e.description;
  if (e.url) attrs.url = e.url;

  if (e.alarmMinutesBefore !== undefined) {
    const hours = Math.floor(e.alarmMinutesBefore / 60);
    const minutes = e.alarmMinutesBefore % 60;
    attrs.alarms = [
      {
        action: 'display',
        description: 'Erinnerung',
        trigger: { hours, minutes, before: true },
      },
    ];
  }

  return attrs;
}

export function generateAndDownloadICS(events: CalendarEvent[]): string | null {
  const { error, value } = createEvents(events.map(mapToEventAttributes));

  if (error || !value) {
    return error?.message ?? 'Fehler beim Erstellen der ICS-Datei.';
  }

  const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kalender-${new Date().toISOString().slice(0, 10)}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return null;
}
