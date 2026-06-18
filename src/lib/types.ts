export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  allDay: boolean;
  location?: string;
  description?: string;
  url?: string;
  alarmMinutesBefore?: number;
}

export interface AlarmPreset {
  label: string;
  minutes: number;
}

export const ALARM_PRESETS: AlarmPreset[] = [
  { label: '15 Minuten vorher', minutes: 15 },
  { label: '30 Minuten vorher', minutes: 30 },
  { label: '1 Stunde vorher', minutes: 60 },
  { label: '2 Stunden vorher', minutes: 120 },
  { label: '1 Tag vorher', minutes: 1440 },
  { label: '1 Woche vorher', minutes: 10080 },
];

export type FormMode = 'add' | 'edit';

export interface EventFormState {
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  allDay: boolean;
  location: string;
  description: string;
  url: string;
  alarmMode: 'none' | 'preset' | 'custom';
  alarmPresetMinutes: number;
  alarmCustomMinutes: string;
  advancedOpen: boolean;
}

export type EventFormErrors = Partial<
  Record<
    'title' | 'startDate' | 'startTime' | 'endDate' | 'endTime' | 'url' | 'alarmCustomMinutes',
    string
  >
>;
