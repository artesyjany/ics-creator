import { useEffect, useState } from 'react';
import Header from './components/Header';
import AddEventButton from './components/AddEventButton';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import DownloadButton from './components/DownloadButton';
import type { CalendarEvent } from './lib/types';
import { loadEvents, saveEvents } from './lib/storage';
import { generateAndDownloadICS } from './lib/icsGenerator';

export default function App() {
  const [events, setEvents] = useState<CalendarEvent[]>(() => loadEvents());
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  function handleAddEvent(event: CalendarEvent) {
    setEvents((prev) => [...prev, event]);
    setFormOpen(false);
  }

  function handleUpdateEvent(event: CalendarEvent) {
    setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)));
    setEditingId(null);
    setFormOpen(false);
  }

  function handleDeleteEvent(id: string) {
    if (window.confirm('Dieses Ereignis wirklich löschen?')) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setFormOpen(false);
      }
    }
  }

  function handleEditStart(id: string) {
    setEditingId(id);
    setFormOpen(true);
    setTimeout(() => {
      document.querySelector<HTMLElement>('.animate-slide-in')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  function handleFormCancel() {
    setFormOpen(false);
    setEditingId(null);
  }

  function handleDownload() {
    setDownloadError(null);
    const error = generateAndDownloadICS(events);
    if (error) setDownloadError(error);
  }

  const editingEvent = editingId ? events.find((e) => e.id === editingId) : undefined;

  return (
    <div className="min-h-dvh flex flex-col" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <Header />

      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-6 space-y-4 pb-36">
        {/* Add button */}
        {!formOpen && (
          <AddEventButton onClick={() => { setEditingId(null); setFormOpen(true); }} />
        )}

        {/* Inline form */}
        {formOpen && (
          <EventForm
            key={editingId ?? 'new'}
            initialValues={editingEvent}
            onSubmit={editingId ? handleUpdateEvent : handleAddEvent}
            onCancel={handleFormCancel}
            mode={editingId ? 'edit' : 'add'}
          />
        )}

        {/* Event list */}
        <EventList events={events} onEdit={handleEditStart} onDelete={handleDeleteEvent} />
      </main>

      {/* Sticky download footer */}
      <footer
        className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3"
        style={{
          background: 'linear-gradient(to top, #F2F2F7 60%, rgba(242,242,247,0))',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        <div className="max-w-xl mx-auto">
          <DownloadButton
            eventCount={events.length}
            onDownload={handleDownload}
            error={downloadError}
          />
        </div>
      </footer>
    </div>
  );
}
