import { CalendarDays } from 'lucide-react';

export default function Header() {
  return (
    <header
      className="bg-white sticky top-0 z-10"
      style={{ borderBottom: '1px solid rgba(60,60,67,0.12)', boxShadow: '0 1px 0 rgba(0,0,0,0.04)' }}
    >
      <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #007AFF 0%, #0055D4 100%)' }}
        >
          <CalendarDays className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-[17px] font-semibold leading-tight" style={{ color: '#1C1C1E' }}>
            ICS Kalender-Ersteller
          </h1>
          <p className="text-[12px] leading-tight mt-0.5" style={{ color: '#6E6E73' }}>
            Termine erstellen & als .ics für iOS exportieren
          </p>
        </div>
      </div>
    </header>
  );
}
