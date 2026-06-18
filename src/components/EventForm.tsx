import { useRef, useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import type { CalendarEvent, EventFormErrors, EventFormState, FormMode } from '../lib/types';
import { ALARM_PRESETS } from '../lib/types';
import { generateId } from '../lib/storage';

interface EventFormProps {
  initialValues?: Partial<CalendarEvent>;
  onSubmit: (event: CalendarEvent) => void;
  onCancel: () => void;
  mode: FormMode;
}

const today = new Date().toISOString().slice(0, 10);

function buildInitialState(initial?: Partial<CalendarEvent>): EventFormState {
  const allDay = initial?.allDay ?? false;
  const alarmMinutes = initial?.alarmMinutesBefore;
  const isPreset =
    alarmMinutes !== undefined && ALARM_PRESETS.some((p) => p.minutes === alarmMinutes);

  return {
    title: initial?.title ?? '',
    startDate: initial?.startDate ?? today,
    startTime: initial?.startTime ?? (allDay ? '' : '09:00'),
    endDate: initial?.endDate ?? initial?.startDate ?? today,
    endTime: initial?.endTime ?? (allDay ? '' : '10:00'),
    allDay,
    location: initial?.location ?? '',
    description: initial?.description ?? '',
    url: initial?.url ?? '',
    alarmMode: alarmMinutes === undefined ? 'none' : isPreset ? 'preset' : 'custom',
    alarmPresetMinutes: isPreset ? alarmMinutes! : ALARM_PRESETS[0].minutes,
    alarmCustomMinutes: !isPreset && alarmMinutes !== undefined ? String(alarmMinutes) : '',
    advancedOpen: !!(
      initial?.location ||
      initial?.description ||
      initial?.url ||
      alarmMinutes !== undefined
    ),
  };
}

const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label
    htmlFor={htmlFor}
    className="block text-[13px] font-semibold mb-1.5 select-none"
    style={{ color: '#6E6E73', textTransform: 'uppercase', letterSpacing: '0.04em' }}
  >
    {children}
  </label>
);

const ErrorMsg = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="text-[12px] mt-1.5 font-medium" style={{ color: '#FF3B30' }}>
      {msg}
    </p>
  ) : null;

export default function EventForm({ initialValues, onSubmit, onCancel, mode }: EventFormProps) {
  const [form, setForm] = useState<EventFormState>(() => buildInitialState(initialValues));
  const [errors, setErrors] = useState<EventFormErrors>({});
  const titleRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof EventFormState>(key: K, value: EventFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleStartDateChange(date: string) {
    setForm((prev) => ({
      ...prev,
      startDate: date,
      endDate: !prev.endDate || prev.endDate < date ? date : prev.endDate,
    }));
    setErrors((prev) => ({ ...prev, startDate: undefined, endDate: undefined }));
  }

  function handleAllDayToggle() {
    setForm((prev) => ({
      ...prev,
      allDay: !prev.allDay,
      startTime: !prev.allDay ? '' : '09:00',
      endTime: !prev.allDay ? '' : '10:00',
    }));
  }

  function validate(): EventFormErrors {
    const e: EventFormErrors = {};
    if (!form.title.trim()) e.title = 'Titel ist erforderlich';
    if (!form.startDate) e.startDate = 'Bitte Startdatum auswählen';
    if (!form.allDay && !form.startTime) e.startTime = 'Bitte Startzeit auswählen';
    if (!form.endDate) e.endDate = 'Bitte Enddatum auswählen';
    if (form.endDate && form.startDate && form.endDate < form.startDate)
      e.endDate = 'Enddatum darf nicht vor dem Startdatum liegen';
    if (!form.allDay) {
      if (!form.endTime) {
        e.endTime = 'Bitte Endzeit auswählen';
      } else if (
        form.startDate === form.endDate &&
        form.startTime &&
        form.endTime <= form.startTime
      ) {
        e.endTime = 'Endzeit muss nach der Startzeit liegen';
      }
    }
    if (form.url && !/^https?:\/\/.+/.test(form.url.trim()))
      e.url = 'Ungültige URL (z.B. https://beispiel.at)';
    if (form.alarmMode === 'custom') {
      const mins = parseInt(form.alarmCustomMinutes, 10);
      if (!form.alarmCustomMinutes || isNaN(mins) || mins < 1)
        e.alarmCustomMinutes = 'Bitte eine gültige Minutenzahl eingeben (min. 1)';
    }
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0] as keyof EventFormErrors;
      document.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }

    let alarmMinutesBefore: number | undefined;
    if (form.alarmMode === 'preset') alarmMinutesBefore = form.alarmPresetMinutes;
    else if (form.alarmMode === 'custom')
      alarmMinutesBefore = parseInt(form.alarmCustomMinutes, 10);

    onSubmit({
      id: initialValues?.id ?? generateId(),
      title: form.title.trim(),
      startDate: form.startDate,
      startTime: form.allDay ? '' : form.startTime,
      endDate: form.endDate,
      endTime: form.allDay ? '' : form.endTime,
      allDay: form.allDay,
      location: form.location.trim() || undefined,
      description: form.description.trim() || undefined,
      url: form.url.trim() || undefined,
      alarmMinutesBefore,
    });
  }

  const inputCls = (hasError?: string) =>
    `ios-input${hasError ? ' error' : ''}`;

  return (
    <div
      className="animate-slide-in bg-white rounded-2xl overflow-hidden card-shadow-md"
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          background: 'linear-gradient(135deg, #007AFF 0%, #0055D4 100%)',
        }}
      >
        <span className="text-[15px] font-semibold text-white">
          {mode === 'add' ? 'Neues Ereignis' : 'Ereignis bearbeiten'}
        </span>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Schließen"
          className="w-7 h-7 flex items-center justify-center rounded-full cursor-pointer transition-opacity hover:opacity-80"
          style={{ background: 'rgba(255,255,255,0.20)' }}
        >
          <X className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate className="p-4 space-y-5">
        {/* Title */}
        <div>
          <Label htmlFor="title">
            Titel <span style={{ color: '#FF3B30' }}>*</span>
          </Label>
          <input
            ref={titleRef}
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="z.B. Arzttermin"
            autoFocus
            className={inputCls(errors.title)}
          />
          <ErrorMsg msg={errors.title} />
        </div>

        {/* All-day toggle */}
        <div
          className="flex items-center justify-between p-3 rounded-xl"
          style={{ background: '#F2F2F7' }}
        >
          <span className="text-[15px] font-medium select-none" style={{ color: '#1C1C1E' }}>
            Ganztägig
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={form.allDay}
            onClick={handleAllDayToggle}
            className="relative flex-shrink-0 cursor-pointer focus:outline-none"
            style={{
              width: '51px',
              height: '31px',
              borderRadius: '999px',
              background: form.allDay ? '#34C759' : '#E5E5EA',
              transition: 'background 0.2s ease',
            }}
          >
            <span
              className="absolute top-0.5 bg-white rounded-full"
              style={{
                width: '27px',
                height: '27px',
                left: form.allDay ? '22px' : '2px',
                transition: 'left 0.2s cubic-bezier(0.22,1,0.36,1)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.20)',
              }}
            />
          </button>
        </div>

        {/* Date/Time grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="startDate">
              Start <span style={{ color: '#FF3B30' }}>*</span>
            </Label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className={inputCls(errors.startDate)}
            />
            <ErrorMsg msg={errors.startDate} />
          </div>
          <div>
            <Label htmlFor="endDate">
              Ende <span style={{ color: '#FF3B30' }}>*</span>
            </Label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={form.endDate}
              min={form.startDate}
              onChange={(e) => set('endDate', e.target.value)}
              className={inputCls(errors.endDate)}
            />
            <ErrorMsg msg={errors.endDate} />
          </div>

          {!form.allDay && (
            <>
              <div>
                <Label htmlFor="startTime">Von</Label>
                <input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={form.startTime}
                  onChange={(e) => set('startTime', e.target.value)}
                  className={inputCls(errors.startTime)}
                />
                <ErrorMsg msg={errors.startTime} />
              </div>
              <div>
                <Label htmlFor="endTime">Bis</Label>
                <input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={form.endTime}
                  onChange={(e) => set('endTime', e.target.value)}
                  className={inputCls(errors.endTime)}
                />
                <ErrorMsg msg={errors.endTime} />
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(60,60,67,0.10)' }} />

        {/* Advanced toggle */}
        <button
          type="button"
          onClick={() => set('advancedOpen', !form.advancedOpen)}
          className="flex items-center justify-between w-full cursor-pointer group"
        >
          <span className="text-[15px] font-medium" style={{ color: '#007AFF' }}>
            Erweiterte Einstellungen
          </span>
          <div
            className="w-6 h-6 flex items-center justify-center rounded-full transition-colors"
            style={{ background: 'rgba(0,122,255,0.10)' }}
          >
            {form.advancedOpen ? (
              <ChevronUp className="w-3.5 h-3.5" style={{ color: '#007AFF' }} strokeWidth={2.5} />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" style={{ color: '#007AFF' }} strokeWidth={2.5} />
            )}
          </div>
        </button>

        {/* Advanced fields */}
        {form.advancedOpen && (
          <div className="space-y-4 animate-slide-in">
            <div style={{ height: '1px', background: 'rgba(60,60,67,0.08)' }} />

            <div>
              <Label htmlFor="location">Ort</Label>
              <input
                id="location"
                name="location"
                type="text"
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                placeholder="z.B. Hauptplatz 1, Graz"
                className="ios-input"
              />
            </div>

            <div>
              <Label htmlFor="description">Beschreibung</Label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Notizen zum Ereignis…"
                rows={3}
                className="ios-input resize-none"
                style={{ lineHeight: '1.5' }}
              />
            </div>

            <div>
              <Label htmlFor="url">URL</Label>
              <input
                id="url"
                name="url"
                type="url"
                value={form.url}
                onChange={(e) => set('url', e.target.value)}
                placeholder="https://beispiel.at"
                className={inputCls(errors.url)}
              />
              <ErrorMsg msg={errors.url} />
            </div>

            <div>
              <Label htmlFor="alarmMode">Erinnerung</Label>
              <select
                id="alarmMode"
                name="alarmMode"
                value={
                  form.alarmMode === 'none'
                    ? 'none'
                    : form.alarmMode === 'custom'
                    ? 'custom'
                    : String(form.alarmPresetMinutes)
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'none') {
                    setForm((p) => ({ ...p, alarmMode: 'none', alarmCustomMinutes: '' }));
                  } else if (val === 'custom') {
                    setForm((p) => ({ ...p, alarmMode: 'custom' }));
                  } else {
                    setForm((p) => ({
                      ...p,
                      alarmMode: 'preset',
                      alarmPresetMinutes: parseInt(val, 10),
                    }));
                  }
                  setErrors((p) => ({ ...p, alarmCustomMinutes: undefined }));
                }}
                className="ios-input cursor-pointer"
              >
                <option value="none">Keine Erinnerung</option>
                {ALARM_PRESETS.map((p) => (
                  <option key={p.minutes} value={String(p.minutes)}>
                    {p.label}
                  </option>
                ))}
                <option value="custom">Benutzerdefiniert…</option>
              </select>

              {form.alarmMode === 'custom' && (
                <div className="mt-2 flex items-center gap-2">
                  <input
                    id="alarmCustomMinutes"
                    name="alarmCustomMinutes"
                    type="number"
                    min="1"
                    value={form.alarmCustomMinutes}
                    onChange={(e) => set('alarmCustomMinutes', e.target.value)}
                    placeholder="z.B. 45"
                    className={`ios-input ${errors.alarmCustomMinutes ? 'error' : ''}`}
                    style={{ flex: 1 }}
                  />
                  <span className="text-[14px] whitespace-nowrap" style={{ color: '#6E6E73' }}>
                    Minuten
                  </span>
                  <ErrorMsg msg={errors.alarmCustomMinutes} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2.5 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 font-semibold rounded-2xl transition-all duration-150 cursor-pointer"
            style={{
              height: '48px',
              fontSize: '15px',
              background: 'rgba(120,120,128,0.12)',
              color: '#1C1C1E',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(120,120,128,0.18)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(120,120,128,0.12)')}
          >
            Abbrechen
          </button>
          <button
            type="submit"
            className="flex-1 font-semibold rounded-2xl transition-all duration-150 cursor-pointer text-white"
            style={{
              height: '48px',
              fontSize: '15px',
              background: 'linear-gradient(135deg, #007AFF 0%, #0055D4 100%)',
              boxShadow: '0 2px 8px rgba(0,122,255,0.30)',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {mode === 'add' ? 'Hinzufügen' : 'Speichern'}
          </button>
        </div>
      </form>
    </div>
  );
}
